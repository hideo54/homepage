import airportData from 'airport-data-js';
import { flights } from '../data/flights';
import type {
    Coordinates,
    FlightRoutesData,
} from '../data/schema/flight-routes';
import { writeGenerated } from './io';

const main = async () => {
    const codes = Array.from(new Set(flights.flat()));
    const results = await airportData.getMultipleAirports(codes);
    const missing = codes.filter((_, i) => !results[i]);
    if (missing.length > 0) {
        throw new Error(`Unknown airports: ${missing.join(', ')}`);
    }
    const airports: Record<string, Coordinates> = Object.fromEntries(
        results
            .filter(airport => airport !== null)
            .map(airport => [
                airport.iata,
                [airport.latitude, airport.longitude],
            ]),
    );
    const routes = flights.map(([from, to]) => {
        const [startLat, startLng] = airports[from];
        const [endLat, endLng] = airports[to];
        return { endLat, endLng, startLat, startLng };
    });
    await writeGenerated('flight-routes', {
        airports,
        routes,
    } satisfies FlightRoutesData);
};

main();
