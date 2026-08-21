import { getPrefectureId, type prefectureNames } from 'jp-local-gov';
import scrapeIt from 'scrape-it';
import { Agent, fetch } from 'undici';
import type { MaimaiData } from '../data/schema/maimai';
import { writeGenerated } from './io';

const segaId = process.env.SEGA_ID ?? '';
const password = process.env.SEGA_PASSWORD ?? '';

// maimaidx.jp は中間証明書を配信しないため、このホストに限り検証を緩める
const dispatcher = new Agent({
    connect: { rejectUnauthorized: false },
});

const extractCookieValue = (cookies: string[], key: string) =>
    cookies
        .join(';')
        .split(';')
        .filter(str => str.includes(key))[0]
        ?.replace(`${key}=`, '');

const getUserId = async () => {
    const formUrl = 'https://maimaidx.jp/maimai-mobile/';
    const initialRes = await fetch(formUrl, {
        dispatcher,
        headers: {
            Cookie: `segaId=${segaId}`,
        },
    });
    const initialCookies = initialRes.headers.getSetCookie();
    const token = extractCookieValue(initialCookies, '_t');
    const userId = extractCookieValue(initialCookies, 'userId');

    const loginUrl = 'https://maimaidx.jp/maimai-mobile/submit/';
    await fetch(loginUrl, {
        body: new URLSearchParams({
            password,
            save_cookie: 'on',
            segaId,
            token,
        }),
        dispatcher,
        headers: {
            Cookie: `_t=${token}; userId=${userId}`,
        },
        method: 'POST',
    });

    const aimeSelectUrl =
        'https://maimaidx.jp/maimai-mobile/aimeList/submit/?idx=0';
    const aimeSelectRes = await fetch(aimeSelectUrl, {
        dispatcher,
        headers: {
            Cookie: `_t=${token}; userId=${userId}; segaId=${segaId}`,
            Referer: 'https://maimaidx.jp/maimai-mobile/aimeList/',
        },
        redirect: 'manual',
    });
    return {
        token,
        userId: extractCookieValue(
            aimeSelectRes.headers.getSetCookie(),
            'userId',
        ),
    };
};

const getMaimaiData = async () => {
    const { token, userId } = await getUserId();

    const angyaUrl = 'https://maimaidx.jp/maimai-mobile/playerData/region/';
    const angyaHtml = await (
        await fetch(angyaUrl, {
            dispatcher,
            headers: {
                Cookie: `_t=${token}; userId=${userId}`,
            },
        })
    ).text();
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
    const expertRecordsHtml = await (
        await fetch(expertRecordsUrl, {
            dispatcher,
            headers: {
                Cookie: `_t=${token}; userId=${userId}`,
            },
        })
    ).text();
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
        // スコア未取得 (未プレイ) の曲を除く。型述語で null を落とす。
        .filter((record): record is typeof record & { score: number } =>
            Boolean(record.score),
        )
        .map(record => ({
            isStandard:
                typeof record.isStandardSelected === 'boolean'
                    ? record.isStandardSelected
                    : record.isStandardAlone,
            level: record.level,
            name: record.name,
            score: record.score,
        }))
        .sort((a, b) => (a.score > b.score ? -1 : 1));

    return {
        expertRecords: availableExpertRecords,
        prefectures: prefectureIds,
    } satisfies MaimaiData;
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
} satisfies MaimaiData; // For CI without env values

const main = async () => {
    const maimaiData = segaId ? await getMaimaiData() : sampleData;
    await writeGenerated('maimai', maimaiData);
};

main();
