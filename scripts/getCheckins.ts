import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import * as turf from '@turf/turf';
import { prefectureIds } from 'jp-local-gov';
import { countBy } from 'lodash';
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
    const allVisitedCountries = Object.entries(
        countBy(
            allCheckins.map(checkin => checkin.venue.location.country)
        )
    ).sort((a, b) => a[1] > b[1] ? -1 : 1).map(e => e[0]);
    const allVisitedUSStates = Object.entries(
        countBy(
            allCheckins.filter(checkin => checkin.venue.location.country === 'アメリカ合衆国')
                .map(checkin => checkin.venue.location.state)
        )
    ).sort((a, b) => a[1] > b[1] ? -1 : 1).map(e => e[0]);
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
    const checkinData = {
        senkyokuVisitCounts,
        allVisitedCountries,
        allVisitedUSStates,
    };
    await fs.writeFile(
        __dirname + '/../lib/swarm-data.json',
        JSON.stringify(checkinData)
    );
};

main();
