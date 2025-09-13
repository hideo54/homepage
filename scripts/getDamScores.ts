import fs from 'node:fs/promises';
import path from 'node:path';
import axios from 'axios';
import dotenv from 'dotenv';
import { XMLParser } from 'fast-xml-parser';
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { scrapeHTML } from 'scrape-it';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const getUnixTime = () => new Date().getTime();

const naturalRange = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

type Score = {
    '#text': number;
    scoringAiId: string; // numeric
    requestNo: string;
    contentsName: string; // song name
    artistName: string;
    dContentsName: string;
    dArtistName: string;
    damserial: string;
    dataKind: string;
    dataSize: string;
    scoringEngineVersionNumber: string;
    edyId: string;
    clubDamCardNo: string;
    entryCount: string; // numeric
    topRecordNumber: string;
    lastPerformKey: string; // numeric
    requestNoTray: string; // numeric
    requestNoChapter: string; // numeric
    fadeout: string; // numeric
    analysisReportCommentNo: string; //numeric
    radarChartPitch: string; // numeric
    radarChartStability: string; //numeric
    radarChartExpressive: string; //numeric
    radarChartVibratoLongtone: string; //numeric
    radarChartRhythm: string; // numeric
    spare1: string;
    singingRangeHighest: string; // numeric
    singingRangeLowest: string; // numeric
    vocalRangeHighest: string; // numeric
    vocalRangeLowest: string; // numeric
    intonation: string; // numeric
    kobushiCount: string; // numeric
    shakuriCount: string; // numeric
    fallCount: string; // numeric
    timing: string; // numeric
    longtoneSkill: string; // numeric
    vibratoSkill: string; // numeric
    vibratoType: string; // numeric
    vibratoTotalSecond: string; // numeric
    vibratoCount: string; // numeric
    accentCount: string; // numeric
    hammeringOnCount: string; // numeric
    edgeVoiceCount: string; // numeric
    hiccupCount: string; // numeric
    aiSensitivityMeterAdd: string; // numeric
    aiSensitivityMeterDeduct: string; // numeric
    aiSensitivityPoints: string; // numeric
    aiSensitivityBonus: string; // numeric
    nationalAverageTotalPoints: string; // numeric
    nationalAveragePitch: string; // numeric
    nationalAverageStability: string; // numeric
    nationalAverageExpression: string; // numeric
    nationalAverageVibratoAndLongtone: string; // numeric
    nationalAverageRhythm: string; // numeric
    spare2: string; // numeric
    intervalGraphPointsSection01: string;
    intervalGraphPointsSection02: string;
    intervalGraphPointsSection03: string;
    intervalGraphPointsSection04: string;
    intervalGraphPointsSection05: string;
    intervalGraphPointsSection06: string;
    intervalGraphPointsSection07: string;
    intervalGraphPointsSection08: string;
    intervalGraphPointsSection09: string;
    intervalGraphPointsSection10: string;
    intervalGraphPointsSection11: string;
    intervalGraphPointsSection12: string;
    intervalGraphPointsSection13: string;
    intervalGraphPointsSection14: string;
    intervalGraphPointsSection15: string;
    intervalGraphPointsSection16: string;
    intervalGraphPointsSection17: string;
    intervalGraphPointsSection18: string;
    intervalGraphPointsSection19: string;
    intervalGraphPointsSection20: string;
    intervalGraphPointsSection21: string;
    intervalGraphPointsSection22: string;
    intervalGraphPointsSection23: string;
    intervalGraphPointsSection24: string;
    intervalGraphIndexSection01: string;
    intervalGraphIndexSection02: string;
    intervalGraphIndexSection03: string;
    intervalGraphIndexSection04: string;
    intervalGraphIndexSection05: string;
    intervalGraphIndexSection06: string;
    intervalGraphIndexSection07: string;
    intervalGraphIndexSection08: string;
    intervalGraphIndexSection09: string;
    intervalGraphIndexSection10: string;
    intervalGraphIndexSection11: string;
    intervalGraphIndexSection12: string;
    intervalGraphIndexSection13: string;
    intervalGraphIndexSection14: string;
    intervalGraphIndexSection15: string;
    intervalGraphIndexSection16: string;
    intervalGraphIndexSection17: string;
    intervalGraphIndexSection18: string;
    intervalGraphIndexSection19: string;
    intervalGraphIndexSection20: string;
    intervalGraphIndexSection21: string;
    intervalGraphIndexSection22: string;
    intervalGraphIndexSection23: string;
    intervalGraphIndexSection24: string;
    maxTotalPoints: string;
    scoringDateTime: string;
    aiSensitivityGraphAddPointsSection01: string;
    aiSensitivityGraphAddPointsSection02: string;
    aiSensitivityGraphAddPointsSection03: string;
    aiSensitivityGraphAddPointsSection04: string;
    aiSensitivityGraphAddPointsSection05: string;
    aiSensitivityGraphAddPointsSection06: string;
    aiSensitivityGraphAddPointsSection07: string;
    aiSensitivityGraphAddPointsSection08: string;
    aiSensitivityGraphAddPointsSection09: string;
    aiSensitivityGraphAddPointsSection10: string;
    aiSensitivityGraphAddPointsSection11: string;
    aiSensitivityGraphAddPointsSection12: string;
    aiSensitivityGraphAddPointsSection13: string;
    aiSensitivityGraphAddPointsSection14: string;
    aiSensitivityGraphAddPointsSection15: string;
    aiSensitivityGraphAddPointsSection16: string;
    aiSensitivityGraphAddPointsSection17: string;
    aiSensitivityGraphAddPointsSection18: string;
    aiSensitivityGraphAddPointsSection19: string;
    aiSensitivityGraphAddPointsSection20: string;
    aiSensitivityGraphAddPointsSection21: string;
    aiSensitivityGraphAddPointsSection22: string;
    aiSensitivityGraphAddPointsSection23: string;
    aiSensitivityGraphAddPointsSection24: string;
    aiSensitivityGraphDeductPointsSection01: string;
    aiSensitivityGraphDeductPointsSection02: string;
    aiSensitivityGraphDeductPointsSection03: string;
    aiSensitivityGraphDeductPointsSection04: string;
    aiSensitivityGraphDeductPointsSection05: string;
    aiSensitivityGraphDeductPointsSection06: string;
    aiSensitivityGraphDeductPointsSection07: string;
    aiSensitivityGraphDeductPointsSection08: string;
    aiSensitivityGraphDeductPointsSection09: string;
    aiSensitivityGraphDeductPointsSection10: string;
    aiSensitivityGraphDeductPointsSection11: string;
    aiSensitivityGraphDeductPointsSection12: string;
    aiSensitivityGraphDeductPointsSection13: string;
    aiSensitivityGraphDeductPointsSection14: string;
    aiSensitivityGraphDeductPointsSection15: string;
    aiSensitivityGraphDeductPointsSection16: string;
    aiSensitivityGraphDeductPointsSection17: string;
    aiSensitivityGraphDeductPointsSection18: string;
    aiSensitivityGraphDeductPointsSection19: string;
    aiSensitivityGraphDeductPointsSection20: string;
    aiSensitivityGraphDeductPointsSection21: string;
    aiSensitivityGraphDeductPointsSection22: string;
    aiSensitivityGraphDeductPointsSection23: string;
    aiSensitivityGraphDeductPointsSection24: string;
    aiSensitivityGraphIndexSection01: string;
    aiSensitivityGraphIndexSection02: string;
    aiSensitivityGraphIndexSection03: string;
    aiSensitivityGraphIndexSection04: string;
    aiSensitivityGraphIndexSection05: string;
    aiSensitivityGraphIndexSection06: string;
    aiSensitivityGraphIndexSection07: string;
    aiSensitivityGraphIndexSection08: string;
    aiSensitivityGraphIndexSection09: string;
    aiSensitivityGraphIndexSection10: string;
    aiSensitivityGraphIndexSection11: string;
    aiSensitivityGraphIndexSection12: string;
    aiSensitivityGraphIndexSection13: string;
    aiSensitivityGraphIndexSection14: string;
    aiSensitivityGraphIndexSection15: string;
    aiSensitivityGraphIndexSection16: string;
    aiSensitivityGraphIndexSection17: string;
    aiSensitivityGraphIndexSection18: string;
    aiSensitivityGraphIndexSection19: string;
    aiSensitivityGraphIndexSection20: string;
    aiSensitivityGraphIndexSection21: string;
    aiSensitivityGraphIndexSection22: string;
    aiSensitivityGraphIndexSection23: string;
    aiSensitivityGraphIndexSection24: string;
};

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
    const scoresData: Score[] = parser
        .parse(scoresRes.data)
        .document.list.data.map((d: { scoring: Score }) => d.scoring);
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

    await fs.writeFile(
        path.join(__dirname, '../lib/dam-scores.json'),
        JSON.stringify((await scoresRef.get()).docs.map(doc => doc.data())),
    );
};

(async () => {
    if (loginId) {
        await main();
    } else {
        const sampleDataStr = await fs.readFile(
            path.join(__dirname, './dam-scores.sample.json'),
            'utf-8',
        );
        await fs.writeFile(
            path.join(__dirname, '../lib/dam-scores.json'),
            sampleDataStr,
        );
    }
})();
