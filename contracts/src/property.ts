import {Entity} from './entity';
import {GeoCoordinate} from './geo.coordinate';

export interface Property extends Entity {
  boundaryHash: string;
  ownerId: string;
  centre: GeoCoordinate;
}
