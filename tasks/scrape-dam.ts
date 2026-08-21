import fs from 'node:fs/promises';
import path from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { scrapeHTML } from 'scrape-it';
import type { DamScore } from '../data/schema/dam';
import { writeGenerated } from './io';

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
    const scoresData: DamScore[] = parser
        .parse(await scoresRes.text())
        .document.list.data.map((d: { scoring: DamScore }) => d.scoring);
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
    const myPageData = scrapeHTML<{
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
        });
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
        (await scoresRef.get()).docs.map(doc => doc.data()),
    );
};

(async () => {
    if (loginId) {
        await main();
    } else {
        const sampleData = JSON.parse(
            await fs.readFile(
                path.join(__dirname, 'fixtures/dam-scores.sample.json'),
                'utf-8',
            ),
        );
        await writeGenerated('dam-scores', sampleData);
    }
})();
