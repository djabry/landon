import { Injectable } from '@angular/core';
import {Property} from '../../contracts/src/property';

@Injectable({
  providedIn: 'root'
})
export class BlockService {

  constructor() {

  }

  async findProperty(propertyId: string): Promise<Property> {

    return undefined;
  }
}
