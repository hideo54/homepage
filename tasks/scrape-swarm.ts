import fs from 'node:fs/promises';
import * as turf from '@turf/turf';
import dayjs from 'dayjs';
import type { Feature, Position } from 'geojson';
import isoCountries from 'i18n-iso-countries';
import { prefectureIds, prefectureInfos } from 'jp-local-gov';
import type { Keikenchi, SwarmData } from '../data/schema/swarm';
import { dataPath, withCache, writeGenerated } from './io';

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

const getCheckins = async ({
    offset,
    limit,
}: {
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
    const params = new URLSearchParams({
        limit: String(limit),
        locale: 'ja',
        oauth_token: process.env.FOURSQUARE_ACCESS_TOKEN,
        offset: String(offset),
        v: '20230211',
    });
    const res = await fetch(
        `https://api.foursquare.com/v2/users/self/checkins?${params}`,
    );
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = (await res.json()) as CheckinResponse;
    return data.response;
};

const calcSenkyokuVisitCounts = (
    geoJson: {
        features: (Feature & {
            geometry: {
                coordinates: Position[][][];
            };
        })[];
        coordinates: number[][][];
    },
    allCoordinates: Set<number[]>,
) =>
    geoJson.features
        .map(senkyoku => {
            const prefNum =
                senkyoku.properties?.ken || senkyoku.properties?.KEN;
            const senkyokuNum =
                senkyoku.properties?.ku || senkyoku.properties?.SENKYOKU;
            const prefId = prefectureIds[parseInt(prefNum, 10) - 1];
            const senkyokuId = `${prefId}-${senkyokuNum}`;
            const senkyokuPolygon = turf.multiPolygon(
                senkyoku.geometry.coordinates,
            );
            const coordinatesInside = Array.from(allCoordinates).filter(
                coordinates =>
                    turf.booleanPointInPolygon(
                        turf.point(coordinates),
                        senkyokuPolygon,
                    ),
            );
            return [senkyokuId, coordinatesInside.length] as [string, number];
        })
        .sort((a, b) => -(a[1] - b[1]));

const fetchAllCheckins = async () => {
    console.log('No cache found. Fetching all checkins...');
    const allCheckins: CheckinResponse['response']['checkins']['items'] = [];
    let numberOfCheckins = 5000;
    while (allCheckins.length < numberOfCheckins) {
        const res = await getCheckins({
            limit: 500,
            offset: allCheckins.length,
        });
        allCheckins.push(...res.checkins.items);
        numberOfCheckins = res.checkins.count;
        console.log(`Fetched ${allCheckins.length} / ${numberOfCheckins}.`);
    }
    return allCheckins;
};

type Checkin = CheckinResponse['response']['checkins']['items'][number];

const manualKeikenchi: Record<string, Keikenchi> = {
    ehime: 4, // 2019年3月、傷心旅行 (スーパー温泉に宿泊)
    fukuoka: 4, // 2019年9月、ミニキャンプチューター (チェックイン忘れ)。あと2023年竹中ゼミ。
    hiroshima: 4, // 2019年3月、傷心旅行 (チェックイン忘れ)
    hyogo: 4, // 中学1年生、部活動の合宿
    kagoshima: 4, // 車中泊 (2025/3/30)
    kanagawa: 4, // 2015年8月、Mine の家
    nagasaki: 4, // 2014年1月、家族旅行 (チェックイン忘れ)
    nara: 4, // 小学生時代
    osaka: 5, // 実家 (1999–2019)
    shiga: 4, // 小学生時代
    tokyo: 5, // 一人暮らし (2019–)
    toyama: 1, // 2014年5月、中学校の野外活動で通過
    // 以下、やっぱ誤魔化さずにちゃんと住民票ベースにしようということで、廃止
    // saga: 5, // 2023年3月、免許合宿でホテルに12泊し、佐賀に親しみを覚えたので、実質居住
    // kumamoto: 5, // 2023年6月、人工知能学会でホテルに5泊し、熊本に親しみを覚えたので、実質居住
};

const calcKeikenchi = (allCheckins: Checkin[]) => {
    const checkinsByState = Object.groupBy(
        allCheckins.filter(checkin => !checkin.private),
        checkin => checkin.venue.location.state,
    );
    const keikenchi = Object.fromEntries(
        prefectureInfos.map(prefInfo => {
            const checkins = checkinsByState[prefInfo.name] ?? [];
            const categories = new Set(
                checkins.flatMap(checkin =>
                    checkin.venue.categories.map(category => category.name),
                ),
            );
            const value = ((): Keikenchi => {
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
            return [prefInfo.id, value];
        }),
    );
    for (const [key, value] of Object.entries(manualKeikenchi)) {
        if (keikenchi[key] < value) {
            keikenchi[key] = value;
        }
    }
    return keikenchi;
};

const toMonth = (unixTime: number) => dayjs(unixTime * 1000).format('YYYY-MM');

const calcMonthlyVisitStats = (
    allCheckins: Checkin[],
    senkyokuGeoJson: Parameters<typeof calcSenkyokuVisitCounts>[0],
) => {
    const earliestByCoordinates = new Map<string, Checkin>();
    for (const checkin of allCheckins) {
        const key = `${checkin.venue.location.lng},${checkin.venue.location.lat}`;
        const earliest = earliestByCoordinates.get(key);
        if (!earliest || checkin.createdAt < earliest.createdAt) {
            earliestByCoordinates.set(key, checkin);
        }
    }
    const points = Array.from(earliestByCoordinates.values()).map(checkin =>
        turf.point([checkin.venue.location.lng, checkin.venue.location.lat], {
            month: toMonth(checkin.createdAt),
        }),
    );
    const senkyokuFirstVisitMonths = senkyokuGeoJson.features
        .map(senkyoku => {
            const senkyokuPolygon = turf.multiPolygon(
                senkyoku.geometry.coordinates,
            );
            return points
                .filter(point =>
                    turf.booleanPointInPolygon(point, senkyokuPolygon),
                )
                .map(point => point.properties.month)
                .sort()[0];
        })
        .filter(month => month !== undefined);

    const checkinMonths = allCheckins.map(checkin =>
        toMonth(checkin.createdAt),
    );
    const lastMonth = checkinMonths.reduce((a, b) => (a > b ? a : b));
    const months: string[] = [];
    for (
        let month = dayjs(checkinMonths.reduce((a, b) => (a < b ? a : b)));
        month.format('YYYY-MM') <= lastMonth;
        month = month.add(1, 'month')
    ) {
        months.push(month.format('YYYY-MM'));
    }

    return months.map(month => ({
        keikenchi: Object.values(
            calcKeikenchi(
                allCheckins.filter(
                    checkin => toMonth(checkin.createdAt) <= month,
                ),
            ),
        ).reduce<number>((acc, cur) => acc + cur, 0),
        month,
        senkyoku: senkyokuFirstVisitMonths.filter(m => m <= month).length,
    }));
};

const getCheckinData = async () => {
    const allCheckins = await withCache('checkins', fetchAllCheckins);
    const allCoordinates = new Set(
        allCheckins
            .map(checkin => [
                checkin.venue.location.lng,
                checkin.venue.location.lat,
            ])
            .sort()
            .filter(
                (cur, i, arr) =>
                    // Remove duplicates to reduce size (about 1/3)
                    i === 0 ||
                    (cur[0] !== arr[i - 1][0] && cur[1] !== arr[i - 1][1]),
            ),
    );
    const senkyokuGeoJson2017 = JSON.parse(
        await fs.readFile(dataPath('geo/shu-2017.geojson'), 'utf-8'),
    );
    const senkyokuGeoJson2022 = JSON.parse(
        await fs.readFile(dataPath('geo/shu-2022.geojson'), 'utf-8'),
    );
    const senkyokuVisitCounts2017 = calcSenkyokuVisitCounts(
        senkyokuGeoJson2017,
        allCoordinates,
    );
    const senkyokuVisitCounts2022 = calcSenkyokuVisitCounts(
        senkyokuGeoJson2022,
        allCoordinates,
    );

    const keikenchi = calcKeikenchi(allCheckins);
    const monthlyVisitStats = calcMonthlyVisitStats(
        allCheckins,
        senkyokuGeoJson2022,
    );

    const airportCheckins = allCheckins
        .filter(
            checkin =>
                checkin.venue.categories
                    .map(cat => cat.name)
                    .some(catName => catName.match(/^(国際)?空港$/)) &&
                !checkin.venue.name.includes('滑走路'),
        )
        .map(checkin => ({
            countryCode: checkin.venue.location.cc,
            name: checkin.venue.name,
        }))
        .reverse(); // 訪問順
    const visitedAirports = airportCheckins.filter(
        (airport, i) =>
            airportCheckins.findIndex(a => a.name === airport.name) === i,
    );

    const visitedAirportsByCountry = Object.entries(
        Object.groupBy(visitedAirports, airport => airport.countryCode),
    )
        .map(([countryCode, airports]) => ({
            count: airports?.length ?? 0,
            countryCode,
        }))
        .sort((a, b) => -(a.count - b.count));

    const allVisitedCountries = Array.from(
        new Set(
            allCheckins
                .map(
                    checkin =>
                        checkin.venue.location.country.replace(/ \(.*\)/, ''), // 括弧書を除去 (例: 「スロバキア (スロバキア共和国)」→「スロバキア」)
                )
                .reverse(), // 訪問順
        ),
    );
    const allVisitedCountryCodes = Array.from(
        new Set(
            allCheckins
                .map(checkin =>
                    isoCountries.alpha2ToAlpha3(
                        checkin.venue.location.cc.toUpperCase(),
                    ),
                )
                .reverse(), // 訪問順
        ),
        // 未知の国コードは alpha2ToAlpha3 が undefined を返すので除く
    ).filter(code => code !== undefined);
    const allVisitedUSStates = Array.from(
        new Set(
            allCheckins
                .reverse() // 訪問順
                .filter(
                    checkin =>
                        checkin.venue.location.country === 'アメリカ合衆国',
                )
                .map(checkin => checkin.venue.location.state),
        ),
    );
    const checkinsByCategory = allCheckins.reduce(
        (acc, checkin) => {
            checkin.venue.categories.forEach(category => {
                if (!acc[category.name]) {
                    acc[category.name] = [];
                }
                acc[category.name].push(checkin);
            });
            return acc;
        },
        {} as Record<string, typeof allCheckins>,
    );
    const formatRestaurantName = (name: string) =>
        name
            .split(' ')
            .filter(
                (word, i) =>
                    i === 0 || (!word.endsWith('店') && !word.endsWith('組')),
            )
            .join(' ');
    const allRamenRestaurantNames = Array.from(
        new Set(
            checkinsByCategory.ラーメン屋.map(checkin =>
                formatRestaurantName(checkin.venue.name),
            ),
        ),
    );
    const ramenRestaurantsCheckinCount = Object.fromEntries(
        allRamenRestaurantNames
            .map(
                restaurantName =>
                    [
                        restaurantName,
                        checkinsByCategory.ラーメン屋.filter(
                            checkin =>
                                formatRestaurantName(checkin.venue.name) ===
                                restaurantName,
                        ).length,
                    ] as const,
            )
            .sort((a, b) => -(a[1] - b[1])),
    );

    const oldestCheckinDate = dayjs(allCheckins[0].createdAt * 1000).format(
        'YYYY-MM-DD',
    );
    const newestCheckinDate = dayjs(
        allCheckins[allCheckins.length - 1].createdAt * 1000,
    ).format('YYYY-MM-DD');

    return {
        allVisitedCountries,
        allVisitedCountryCodes,
        allVisitedUSStates,
        keikenchi,
        monthlyVisitStats,
        newestCheckinDate,
        oldestCheckinDate,
        ramenRestaurantsCheckinCount,
        senkyokuVisitCounts2017,
        senkyokuVisitCounts2022,
        visitedAirports,
        visitedAirportsByCountry,
    } satisfies SwarmData;
};

const sampleData = {
    allVisitedCountries: ['日本'],
    // 実データは alpha-3 (isoCountries.alpha2ToAlpha3) なので揃える
    allVisitedCountryCodes: ['JPN'],
    allVisitedUSStates: ['NV'],
    keikenchi: {
        hokkaido: 4,
    },
    monthlyVisitStats: [{ keikenchi: 4, month: '2025-01', senkyoku: 1 }],
    newestCheckinDate: '2025-01-11',
    oldestCheckinDate: '2012-09-17',
    ramenRestaurantsCheckinCount: {
        東京油組総本店: 54,
    },
    senkyokuVisitCounts2017: [['tokyo-1', 282]],
    senkyokuVisitCounts2022: [['tokyo-1', 282]],
    visitedAirports: [
        { countryCode: 'JP', name: '東京国際空港 (羽田空港) (HND)' },
    ],
    visitedAirportsByCountry: [{ count: 1, countryCode: 'JP' }],
} satisfies SwarmData;

const main = async () => {
    const checkinData = process.env.FOURSQUARE_ACCESS_TOKEN
        ? await getCheckinData().catch((): SwarmData => {
              console.warn('Failed to fetch Swarm checkins. Using empty data.');
              return {
                  allVisitedCountries: [],
                  allVisitedCountryCodes: [],
                  allVisitedUSStates: [],
                  keikenchi: {},
                  monthlyVisitStats: [],
                  newestCheckinDate: '',
                  oldestCheckinDate: '',
                  ramenRestaurantsCheckinCount: {},
                  senkyokuVisitCounts2017: [],
                  senkyokuVisitCounts2022: [],
                  visitedAirports: [],
                  visitedAirportsByCountry: [],
              };
          })
        : sampleData;
    await writeGenerated('swarm', checkinData);
};

main();
