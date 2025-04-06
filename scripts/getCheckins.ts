import fs from 'fs/promises';
import path from 'path';
import * as turf from '@turf/turf';
import axios from 'axios';
import dayjs from 'dayjs';
import dotenv from 'dotenv';
import type { Feature, Position } from 'geojson';
import isoCountries from 'i18n-iso-countries';
import { getPrefectureId, prefectureIds, prefectureNames } from 'jp-local-gov';

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
                createdAt: number;
                private?: boolean;
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

const calcSenkyokuVisitCounts = (geoJson: {
    features: (Feature & {
        geometry: {
            coordinates: Position[][][];
        };
    })[];
    coordinates: number[][][];
}, allCoordinates: Set<number[]>) => (
    geoJson.features.map(senkyoku => {
        const prefNum = senkyoku.properties?.ken || senkyoku.properties?.KEN;
        const senkyokuNum = senkyoku.properties?.ku || senkyoku.properties?.SENKYOKU;
        const prefId = prefectureIds[parseInt(prefNum) - 1];
        const senkyokuId = `${prefId}-${senkyokuNum}`;
        const senkyokuPolygon = turf.multiPolygon(senkyoku.geometry.coordinates);
        const coordinatesInside = Array.from(allCoordinates).filter(coordinates =>
            turf.booleanPointInPolygon(turf.point(coordinates), senkyokuPolygon)
        );
        return [senkyokuId, coordinatesInside.length] as [string, number];
    }).sort((a, b) => - (a[1] - b[1]))
);

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
    const senkyokuGeoJson2017 = JSON.parse(
        await fs.readFile(__dirname + '/../lib/shu-2017.geojson', 'utf-8')
    );
    const senkyokuGeoJson2022 = JSON.parse(
        await fs.readFile(__dirname + '/../lib/shu-2022.geojson', 'utf-8')
    );
    const senkyokuVisitCounts2017 = calcSenkyokuVisitCounts(senkyokuGeoJson2017, allCoordinates);
    const senkyokuVisitCounts2022 = calcSenkyokuVisitCounts(senkyokuGeoJson2022, allCoordinates);

    const keikenchi = Object.fromEntries(
        prefectureNames.map(prefName => {
            const prefId = getPrefectureId(prefName);
            const checkins = allCheckins.filter(checkin =>
                !checkin.private
                && checkin.venue.location.state === prefName
            );
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
    const manualKeikenchi = {
        kanagawa: 4, // 2015年8月、Mine の家
        toyama: 1, // 2014年5月、中学校の野外活動で通過
        shiga: 4, // 小学生時代
        nara: 4, // 小学生時代
        hyogo: 4, // 中学1年生、部活動の合宿
        hiroshima: 4, // 2019年3月、傷心旅行 (チェックイン忘れ)
        ehime: 4, // 2019年3月、傷心旅行 (スーパー温泉に宿泊)
        fukuoka: 4, // 2019年9月、ミニキャンプチューター (チェックイン忘れ)。あと2023年竹中ゼミ。
        nagasaki: 4, // 2014年1月、家族旅行 (チェックイン忘れ)
        osaka: 5, // 実家 (1999–2019)
        tokyo: 5, // 一人暮らし (2019–)
        kagoshima: 5, // 車中泊 (2025/3/30)
        // 以下、やっぱ誤魔化さずにちゃんと住民票ベースにしようということで、廃止
        // saga: 5, // 2023年3月、免許合宿でホテルに12泊し、佐賀に親しみを覚えたので、実質居住
        // kumamoto: 5, // 2023年6月、人工知能学会でホテルに5泊し、熊本に親しみを覚えたので、実質居住
    };
    for (const [key, value] of Object.entries(manualKeikenchi)) {
        if (keikenchi[key] < value) {
            keikenchi[key] = value;
        }
    }

    const visitedAirports = Array.from(
        new Set(
            allCheckins.filter(checkin =>
                checkin.venue.categories.map(cat => cat.name).some(catName =>
                    catName.match(/^(国際)?空港$/)
                ) && !checkin.venue.name.includes('滑走路')
            ).map(checkin => checkin.venue.name).reverse() // 訪問順
        )
    );

    const allVisitedCountries = Array.from(
        new Set(
            allCheckins.map(checkin =>
                checkin.venue.location.country
                    .replace('英領', 'イギリス領')
            ).reverse() // 訪問順
        )
    );
    const allVisitedCountryCodes = Array.from(
        new Set(
            allCheckins.map(checkin =>
                isoCountries.alpha2ToAlpha3(
                    checkin.venue.location.cc.toUpperCase()
                )
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
    const checkinsByCategory = allCheckins.reduce((acc, checkin) => {
        checkin.venue.categories.forEach(category => {
            if (!acc[category.name]) {
                acc[category.name] = [];
            }
            acc[category.name].push(checkin);
        });
        return acc;
    }, {} as Record<string, typeof allCheckins>);
    const formatRestrauntName = (name: string) => name.split(' ').filter((word, i) =>
        i == 0 || (!word.endsWith('店') && !word.endsWith('組'))
    ).join(' ');
    const allRamenRestaurantNames = Array.from(
        new Set(
            checkinsByCategory['ラーメン屋'].map(checkin =>
                formatRestrauntName(checkin.venue.name)
            )
        )
    );
    const ramenRestaurantsCheckinCount = Object.fromEntries(
        allRamenRestaurantNames.map(restaurantName =>
            [
                restaurantName,
                checkinsByCategory['ラーメン屋'].filter(checkin =>
                    formatRestrauntName(checkin.venue.name) === restaurantName
                ).length,
            ] as const
        ).sort((a, b) => - (a[1] - b[1]))
    );

    const oldestCheckinDate = dayjs(allCheckins[0].createdAt * 1000).format('YYYY-MM-DD');
    const newestCheckinDate = dayjs(allCheckins[allCheckins.length - 1].createdAt * 1000).format('YYYY-MM-DD');

    const checkinData = {
        senkyokuVisitCounts2017,
        senkyokuVisitCounts2022,
        keikenchi,
        visitedAirports,
        allVisitedCountries,
        allVisitedCountryCodes,
        allVisitedUSStates,
        ramenRestaurantsCheckinCount,
        oldestCheckinDate,
        newestCheckinDate,
    };
    return checkinData;
};

const sampleData = {
    senkyokuVisitCounts2017: [
        ['tokyo-1', 282],
    ],
    senkyokuVisitCounts2022: [
        ['tokyo-1', 282],
    ],
    keikenchi: {
        hokkaido: 4,
    },
    visitedAirports: ['東京国際空港 (羽田空港) (HND)'],
    allVisitedCountries: ['日本'],
    allVisitedCountryCodes: ['JP'],
    allVisitedUSStates: ['NV'],
    ramenRestaurantsCheckinCount: {
        '東京油組総本店': 54,
    },
    oldestCheckinDate: '2012-09-17',
    newestCheckinDate: '2025-01-11',
};

const main = async () => {
    const checkinData = process.env.FOURSQUARE_ACCESS_TOKEN ? await getCheckinData() : sampleData;
    await fs.writeFile(
        __dirname + '/../lib/swarm-data.json',
        JSON.stringify(checkinData)
    );
};

main();
