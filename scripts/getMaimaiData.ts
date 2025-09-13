import fs from 'node:fs/promises';
import https from 'node:https';
import path from 'node:path';
import axios, { type AxiosError } from 'axios';
import dotenv from 'dotenv';
import { getPrefectureId, type prefectureNames } from 'jp-local-gov';
import scrapeIt from 'scrape-it';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const segaId = process.env.SEGA_ID!;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const password = process.env.SEGA_PASSWORD!;

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

const extractCookieValue = (cookieStr: string[] | undefined, key: string) =>
    cookieStr
        ?.join(';')
        .split(';')
        .filter(str => str.includes(key))[0]
        .replace(`${key}=`, '');

const getUserId = async () => {
    const formUrl = 'https://maimaidx.jp/maimai-mobile/';
    const { headers: initialHeader } = await axios.get(formUrl, {
        headers: {
            Cookie: `segaId=${segaId}`,
        },
        httpsAgent,
    });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const token = extractCookieValue(initialHeader['set-cookie'], '_t')!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const userId = extractCookieValue(initialHeader['set-cookie'], 'userId')!;

    const loginUrl = 'https://maimaidx.jp/maimai-mobile/submit/';
    await axios.post(
        loginUrl,
        new URLSearchParams({
            password,
            save_cookie: 'on',
            segaId,
            token,
        }),
        {
            headers: {
                Cookie: `_t=${token}; userId=${userId}`,
            },
            httpsAgent,
        },
    );

    const aimeSelectUrl =
        'https://maimaidx.jp/maimai-mobile/aimeList/submit/?idx=0';
    const numericalUserId = await axios
        .get(aimeSelectUrl, {
            headers: {
                Cookie: `_t=${token}; userId=${userId}; segaId=${segaId}`,
                Referer: 'https://maimaidx.jp/maimai-mobile/aimeList/',
            },
            httpsAgent,
            maxRedirects: 0,
        })
        .catch((e: AxiosError) => {
            const numericalUserId = extractCookieValue(
                e.response?.headers['set-cookie'],
                'userId',
            );
            return numericalUserId;
        });
    return {
        token,
        userId: numericalUserId,
    };
};

const getMaimaiData = async () => {
    const { token, userId } = await getUserId();

    const angyaUrl = 'https://maimaidx.jp/maimai-mobile/playerData/region/';
    const { data: angyaHtml } = await axios.get(angyaUrl, {
        headers: {
            Cookie: `_t=${token}; userId=${userId}`,
        },
        httpsAgent,
    });
    const { prefectures } = scrapeIt.scrapeHTML<{
        prefectures: {
            name: (typeof prefectureNames)[number];
        }[];
    }>(angyaHtml, {
        prefectures: {
            data: {
                name: 'div',
            },
            listItem: 'div.see_through_block',
        },
    });
    const prefectureIds = prefectures.map(pref => getPrefectureId(pref.name));

    const expertRecordsUrl =
        'https://maimaidx.jp/maimai-mobile/record/musicGenre/search/?genre=99&diff=2';
    const { data: expertRecordsHtml } = await axios.get(expertRecordsUrl, {
        headers: {
            Cookie: `_t=${token}; userId=${userId}`,
        },
        httpsAgent,
    });
    const { records: expertRecords } = scrapeIt.scrapeHTML<{
        records: {
            name: string;
            score: number | null;
            level: string;
            isStandardSelected: boolean | undefined;
            isStandardAlone: boolean | undefined;
        }[];
    }>(expertRecordsHtml, {
        records: {
            data: {
                isStandardAlone: {
                    attr: 'src',
                    convert: (s: string) =>
                        s === '' ? undefined : s.includes('music_standard.png'),
                    selector: 'img.music_kind_icon',
                },
                isStandardSelected: {
                    attr: 'class',
                    convert: (s: string) =>
                        s === ''
                            ? undefined
                            : s.includes('music_expert_btn_on'),
                    selector: 'img.music_kind_icon_standard',
                },
                level: 'div.music_lv_block',
                name: 'div.music_name_block',
                score: {
                    convert: (s: string) =>
                        s.endsWith('%')
                            ? Number(s.replace('%', '')) / 100
                            : null,
                    eq: 0,
                    selector: 'div.music_score_block',
                },
            },
            listItem: 'div.main_wrapper > div.w_450.m_15.p_r.f_0',
        },
    });
    const availableExpertRecords = expertRecords
        .filter(record => record.score)
        .map(record => ({
            isStandard:
                typeof record.isStandardSelected === 'boolean'
                    ? record.isStandardSelected
                    : record.isStandardAlone,
            level: record.level,
            name: record.name,
            score: record.score,
        }))
        .sort((a, b) =>
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            a.score! > b.score! ? -1 : 1,
        );

    const maimaiData = {
        expertRecords: availableExpertRecords,
        prefectures: prefectureIds,
    };
    return maimaiData;
};

const sampleData = {
    expertRecords: [
        {
            isStandard: false,
            level: '8',
            name: '君の知らない物語',
            score: 1.004136,
        },
    ],
    prefectures: ['osaka'],
}; // For CI without env values

const main = async () => {
    const maimaiData = segaId ? await getMaimaiData() : sampleData;
    await fs.writeFile(
        __dirname + '/../lib/maimai-data.json',
        JSON.stringify(maimaiData),
    );
};

main();
