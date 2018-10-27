import {Entity} from './entity';

export interface Property extends Entity {
  boundaryHash: string;
  ownerId: string;
}
