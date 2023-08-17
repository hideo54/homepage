import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import * as turf from '@turf/turf';
import { getPrefectureId, prefectureIds, prefectureNames } from 'jp-local-gov';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

interface CheckinResponse {
    meta: {
        code: number;
        requestId: string;
    };
    notifications: object[];
    response: {
        checkins: {
            count: number;
            items: {
                id: string;
                venue: {
                    id: string;
                    name: string;
                    location: {
                        lat: number;
                        lng: number;
                        address: string;
                        crossStreet: string;
                        postalCode: string;
                        cc: string; // "JP" など
                        city: string; // "東京"
                        state: string; // "東京都"
                        country: string; // "日本"
                        formattedAddress: string[];
                    };
                    categories: {
                        id: string;
                        name: string;
                    }[];
                };
            }[];
        };
    };
}

const getCheckins = async ({ offset, limit }: {
    offset: number;
    limit: number;
}): Promise<CheckinResponse['response']> => {
    if (!process.env.FOURSQUARE_ACCESS_TOKEN) {
        return {
            checkins: {
                count: 0,
                items: [],
            },
        };
    }
    const res = await axios.get<CheckinResponse>('https://api.foursquare.com/v2/users/self/checkins', {
        params: {
            oauth_token: process.env.FOURSQUARE_ACCESS_TOKEN,
            v: '20230211',
            locale: 'ja',
            limit,
            offset,
        },
    });
    return res.data.response;
};

const getCheckinData = async () => {
    const cacheFilename = __dirname + '/checkins.cache.json';
    let allCheckins: CheckinResponse['response']['checkins']['items'] = [];
    try {
        const cacheFileString = await fs.readFile(cacheFilename, 'utf-8');
        allCheckins = JSON.parse(cacheFileString);
        console.log('Cache found. Fetch skipped.');
    } catch {
        console.log('No cache found. Fetching all checkins...');
        let numberOfCheckins = 5000;
        while (allCheckins.length < numberOfCheckins) {
            const res = await getCheckins({
                offset: allCheckins.length,
                limit: 500,
            }) as CheckinResponse['response'];
            allCheckins.push(...res.checkins.items);
            numberOfCheckins = res.checkins.count;
            console.log(`Fetched ${allCheckins.length} / ${numberOfCheckins}.`);
        }
        await fs.writeFile(cacheFilename, JSON.stringify(allCheckins), 'utf-8');
    }
    const allCoordinates = new Set(
        allCheckins.map(checkin => [
            checkin.venue.location.lng,
            checkin.venue.location.lat,
        ]).sort().filter((cur, i, arr) =>
            // Remove duplicates to reduce size (about 1/3)
            i === 0 || (cur[0] !== arr[i - 1][0] && cur[1] !== arr[i - 1][1])
        )
    );
    const senkyokuGeoJson = JSON.parse(
        await fs.readFile(__dirname + '/../lib/shu-2017.geojson', 'utf-8')
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const senkyokuVisitCounts = (senkyokuGeoJson.features as any[]).map(senkyoku => {
        const prefNum = senkyoku.properties.ken;
        const senkyokuNum = senkyoku.properties.ku;
        const prefId = prefectureIds[parseInt(prefNum) - 1];
        const senkyokuId = `${prefId}-${senkyokuNum}`;
        const senkyokuPolygon = turf.multiPolygon(senkyoku.geometry.coordinates);
        const coordinatesInside = Array.from(allCoordinates).filter(coordinates =>
            turf.booleanPointInPolygon(turf.point(coordinates), senkyokuPolygon)
        );
        return [senkyokuId, coordinatesInside.length] as [string, number];
    }).sort((a, b) => - (a[1] - b[1]));

    const keikenchi = Object.fromEntries(
        prefectureNames.map(prefName => {
            const prefId = getPrefectureId(prefName);
            const checkins = allCheckins.filter(checkin => checkin.venue.location.state === prefName);
            const categories = new Set(
                checkins.map(checkin =>
                    checkin.venue.categories.map(category => category.name)
                ).flat()
            );
            const value = (() => {
                for (const hotelCategory of [
                    'ホテル',
                    'Bed and Breakfast',
                    'B&Bホテル',
                    'モーテル',
                    '宿屋',
                ]) {
                    if (categories.has(hotelCategory)) return 4;
                }
                if (categories.size === 1 && categories.has('鉄道駅')) return 2;
                if (checkins.length > 0) return 3;
                return 0;
            })();
            return [prefId, value];
        })
    );
    keikenchi.kanagawa = 4; // 2015年8月、Mine の家
    keikenchi.toyama = 1; // 2014年5月、中学校の野外活動で通過
    keikenchi.fukui = 1; // 2014年5月、中学校の野外活動で通過
    keikenchi.shiga = 4; // 小学生時代
    keikenchi.nara = 4; // 小学生時代
    keikenchi.hyogo = 4; // 中学1年生、部活動の合宿
    keikenchi.hiroshima = 4; // 2019年3月、傷心旅行 (チェックイン忘れ)
    keikenchi.ehime = 4; // 2019年3月、傷心旅行 (スーパー温泉に宿泊)
    keikenchi.fukuoka = 4; // 2019年9月、ミニキャンプチューター (チェックイン忘れ)
    keikenchi.nagasaki = 4; // 2014年1月、家族旅行 (チェックイン忘れ)

    keikenchi.yamaguchi = 2; // ちょっと降りただけなので「訪問」はおこがましく「接地」が適切

    keikenchi.osaka = 5; // 実家 (1999–2019)
    keikenchi.tokyo = 5; // 一人暮らし (2019–)
    keikenchi.saga = 5; // 2023年3月、免許合宿でホテルに12泊し、佐賀に親しみを覚えたので、実質居住
    keikenchi.kumamoto = 5; // 2023年6月、人工知能学会でホテルに5泊し、熊本に親しみを覚えたので、実質居住

    const visitedAirports = Array.from(
        new Set(
            allCheckins.filter(checkin =>
                checkin.venue.categories.map(cat => cat.name).includes('空港')
                && !checkin.venue.name.includes('滑走路')
            ).map(checkin => checkin.venue.name).reverse() // 訪問順
        )
    );

    const allVisitedCountries = Array.from(
        new Set(
            allCheckins.map(checkin =>
                checkin.venue.location.country
                    .replace('英領ヴァージン諸島', 'イギリス')
            ).reverse() // 訪問順
        )
    );
    const allVisitedUSStates = Array.from(
        new Set(
            allCheckins.reverse() // 訪問順
                .filter(checkin => checkin.venue.location.country === 'アメリカ合衆国')
                .map(checkin => checkin.venue.location.state)
        )
    );

    const checkinData = {
        senkyokuVisitCounts,
        keikenchi,
        visitedAirports,
        allVisitedCountries,
        allVisitedUSStates,
    };
    return checkinData;
};

const sampleData = {
    senkyokuVisitCounts: [
        ['tokyo-1', 282],
    ],
    keikenchi: {
        hokkaido: 4,
    },
    allVisitedCountries: ['日本'],
    allVisitedUSStates: ['NV'],
};

const main = async () => {
    const checkinData = process.env.FOURSQUARE_ACCESS_TOKEN ? await getCheckinData() : sampleData;
    await fs.writeFile(
        __dirname + '/../lib/swarm-data.json',
        JSON.stringify(checkinData)
    );
};

main();
