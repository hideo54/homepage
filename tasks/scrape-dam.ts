import fs from 'node:fs/promises';
import path from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import scrapeIt from 'scrape-it';
import {
    type DamData,
    type DamScore,
    damHighScoreCount,
    damHighScoreFields,
    damPlayFields,
    damScoreFailureThreshold,
} from '../data/schema/dam';
import { writeGenerated } from './io';

const pick = <K extends keyof DamScore>(
    score: DamScore,
    fields: readonly K[],
) =>
    Object.fromEntries(fields.map(field => [field, score[field]])) as Pick<
        DamScore,
        K
    >;

const toDamData = (scores: DamScore[]): DamData => ({
    highScores: scores
        .toSorted((a, b) => Number(b['#text']) - Number(a['#text']))
        .slice(0, damHighScoreCount)
        .map(score => pick(score, damHighScoreFields)),
    plays: scores
        .filter(
            score =>
                // 途中で歌うのをやめたものは除外
                (Number(score.aiSensitivityGraphAddPointsSection24) > 0 ||
                    Number(score.aiSensitivityGraphDeductPointsSection24) >
                        0) &&
                Number(score['#text']) / 1000 > damScoreFailureThreshold,
        )
        .map(score => pick(score, damPlayFields)),
});

const emptyDamData: DamData = { highScores: [], plays: [] };

const getUnixTime = () => new Date().getTime();

const naturalRange = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

const getScores = async ({
    cdmCardNo,
    cdmToken,
    cookies,
    page,
}: {
    cdmCardNo: string;
    cdmToken: string;
    cookies: string[];
    page: number;
}) => {
    const params = new URLSearchParams({
        cdmCardNo,
        cdmToken,
        detailFlg: '1',
        enc: 'sjis',
        pageNo: String(page),
        UTCserial: String(getUnixTime()),
    });
    const scoresRes = await fetch(
        `https://www.clubdam.com/app/damtomo/scoring/GetScoringAiListXML.do?${params}`,
        {
            headers: {
                Cookie: cookies.join(';'),
            },
        },
    );

    const parser = new XMLParser({
        attributeNamePrefix: '',
        ignoreAttributes: false,
    });
    const document = parser.parse(await scoresRes.text()).document;
    if (document.result?.status === 'NG') {
        return [];
    }
    const rawData = document.list.data;
    const scoresData: DamScore[] = (
        Array.isArray(rawData) ? rawData : [rawData]
    ).map((d: { scoring: DamScore }) => d.scoring);
    return scoresData;
};

const loginId = process.env.DAM_ID;
const password = process.env.DAM_PASSWORD;

const main = async () => {
    admin.initializeApp();
    const loginRes = await fetch(
        'https://www.clubdam.com/app/damtomo/auth/LoginXML.do',
        {
            body: new URLSearchParams({
                enc: 'sjis',
                loginId: loginId ?? '',
                password: password ?? '',
                procKbn: '1',
                UTCserial: String(getUnixTime()),
            }),
            method: 'POST',
        },
    );
    const cookies = loginRes.headers.getSetCookie();
    const cdmCardNo =
        cookies
            .find(cookieStr => cookieStr.startsWith('scr_cdm='))
            ?.split(';')[0]
            .split('=')[1]
            .trim() || '';

    const myPageRes = await fetch(
        'https://www.clubdam.com/app/damtomo/MyPage.do',
        {
            headers: {
                Cookie: cookies.join(';'),
            },
        },
    );
    const myPageData = scrapeIt.scrapeHTML<{
        cdmToken: string;
    }>(await myPageRes.text(), {
        cdmToken: {
            attr: 'value',
            selector: 'input#cdmToken',
        },
    });
    const cdmToken = myPageData.cdmToken;

    const db = getFirestore();
    const scoresRef = db.collection('dam-scores');
    const latestDocs = (
        await scoresRef.orderBy('scoringDateTime', 'desc').limit(1).get()
    ).docs;
    const latestDatetime =
        latestDocs.length > 0
            ? (latestDocs[0].get('scoringDateTime') as string)
            : null;

    const newScores = [];
    // 最新 200 件が保存される。1ページ5件なので、最大で 40 ページ分取得する。
    pageIteration: for (const i of naturalRange(40)) {
        const scores = await getScores({
            cdmCardNo,
            cdmToken,
            cookies,
            page: i,
        }).catch((): DamScore[] => {
            console.warn('Failed to fetch DAM scores. Skipping new scores.');
            newScores.length = 0;
            return [];
        });
        if (scores.length === 0) break;
        for (const score of scores) {
            if (latestDatetime && score.scoringDateTime <= latestDatetime)
                break pageIteration;
            newScores.push(score);
        }
    }

    newScores.reverse();
    for (const score of newScores) {
        console.log('.');
        await db.collection('dam-scores').add(score);
    }

    await writeGenerated(
        'dam-scores',
        toDamData(
            (await scoresRef.get()).docs.map(doc => doc.data() as DamScore),
        ),
    );
};

(async () => {
    if (loginId) {
        await main().catch(async () => {
            console.warn('Failed to scrape DAM. Using empty scores.');
            await writeGenerated('dam-scores', emptyDamData);
        });
    } else {
        const sampleData: DamScore[] = JSON.parse(
            await fs.readFile(
                path.join(
                    import.meta.dirname,
                    'fixtures/dam-scores.sample.json',
                ),
                'utf-8',
            ),
        );
        await writeGenerated('dam-scores', toDamData(sampleData));
    }
})();
