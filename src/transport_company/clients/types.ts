export interface GeoPoint {
  lat: number;
  lng: number;
  address?: string;
}

export interface Client {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
  stationLocation: GeoPoint;
}

export interface CreateClientInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  stationLocation: GeoPoint;
}
