export type IataCode = string;

export type Coordinates = [number, number];

export interface FlightRoute {
    endLat: number;
    endLng: number;
    startLat: number;
    startLng: number;
}

export interface FlightRoutesData {
    airports: Record<IataCode, Coordinates>;
    routes: FlightRoute[];
}
