import {GeoCoordinate} from './geo.coordinate';

export interface CreatePropertyRequest {
  propertyId: string;
  boundaryData: GeoCoordinate[];
  ownerId: string;
  latitude: number;
  longitude: number;
}
