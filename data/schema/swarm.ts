export type PrefectureId = string;

export type AnySenkyokuId = string;

export type CountryCodeAlpha3 = string;

export type CountryCodeAlpha2 = string;

export type Keikenchi = 0 | 1 | 2 | 3 | 4 | 5;

export interface VisitedAirport {
    countryCode: CountryCodeAlpha2;
    name: string;
}

export interface VisitedAirportCount {
    count: number;
    countryCode: CountryCodeAlpha2;
}

export interface SwarmData {
    allVisitedCountries: string[];
    allVisitedCountryCodes: CountryCodeAlpha3[];
    allVisitedUSStates: string[];
    keikenchi: Record<PrefectureId, Keikenchi>;
    newestCheckinDate: string;
    oldestCheckinDate: string;
    ramenRestaurantsCheckinCount: Record<string, number>;
    senkyokuVisitCounts2017: [AnySenkyokuId, number][];
    senkyokuVisitCounts2022: [AnySenkyokuId, number][];
    visitedAirports: VisitedAirport[];
    visitedAirportsByCountry: VisitedAirportCount[];
}
