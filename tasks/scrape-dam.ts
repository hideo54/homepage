import fs from 'node:fs/promises';
import path from 'node:path';
import axios from 'axios';
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
    const scoresRes = await axios.get(
        'https://www.clubdam.com/app/damtomo/scoring/GetScoringAiListXML.do',
        {
            headers: {
                Cookie: cookies?.join(';'),
            },
            params: {
                cdmCardNo,
                cdmToken,
                detailFlg: 1,
                enc: 'sjis',
                pageNo: page,
                UTCserial: getUnixTime(),
            },
        },
    );

    const parser = new XMLParser({
        attributeNamePrefix: '',
        ignoreAttributes: false,
    });
    const scoresData: DamScore[] = parser
        .parse(scoresRes.data)
        .document.list.data.map((d: { scoring: DamScore }) => d.scoring);
    return scoresData;
};

const loginId = process.env.DAM_ID;
const password = process.env.DAM_PASSWORD;

const main = async () => {
    admin.initializeApp();
    const loginRes = await axios.post(
        'https://www.clubdam.com/app/damtomo/auth/LoginXML.do',
        {
            enc: 'sjis',
            loginId,
            password,
            procKbn: 1,
            UTCserial: getUnixTime(),
        },
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        },
    );
    const cookies = loginRes.headers['set-cookie'] || [];
    const cdmCardNo =
        cookies
            ?.find(cookieStr => cookieStr.startsWith('scr_cdm='))
            ?.split(';')[0]
            .split('=')[1]
            .trim() || '';

    const myPageRes = await axios.get(
        'https://www.clubdam.com/app/damtomo/MyPage.do',
        {
            headers: {
                Cookie: cookies?.join(';'),
            },
        },
    );
    const myPageData = scrapeHTML<{
        cdmToken: string;
    }>(myPageRes.data, {
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
