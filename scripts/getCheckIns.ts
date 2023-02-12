import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import * as turf from '@turf/turf';
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

const main = async () => {
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
    // const allVisitedStates = new Set(
    //     allCheckins.map(checkin => checkin.venue.location.state).sort()
    // );
    // const allVisitedCountries = new Set(
    //     allCheckins.map(checkin => checkin.venue.location.country).sort()
    // );
    const senkyokuGeoJson = JSON.parse(
        await fs.readFile(__dirname + '/shu-district-2022.geojson', 'utf-8')
    );
    const senkyokuVisitCounts = senkyokuGeoJson.features.map((senkyoku: any) => {
        const senkyokuName = senkyoku.properties.NAME;
        const senkyokuPolygon = turf.polygon(senkyoku.geometry.coordinates[0]);
        const coordinatesInside = Array.from(allCoordinates).filter(coordinates =>
            turf.booleanPointInPolygon(turf.point(coordinates), senkyokuPolygon)
        );
        return [senkyokuName, coordinatesInside.length];
    }).sort((a: any, b: any) => - (a[1] - b[1]));
    console.log(senkyokuVisitCounts);
};

main();
