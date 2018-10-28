import {GeoCoordinate} from '../../contracts/src/geo.coordinate';
import * as geolib from 'geolib';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RandomPolygonGenerator {
  randomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
  generatePolygon(startingPoint: GeoCoordinate): GeoCoordinate[] {
    let bearing = 0;
    let distance = 1;
    let point = {latitude: startingPoint.latitude, longitude: startingPoint.longitude};
    const points = [
      point
    ];
    const angles = [0, 0, 45, 90];
    const distances = [1, 2, 3, 4, 4];
    while (bearing < 270) {
      bearing += this.randomElement(angles);
      bearing = Math.min(bearing, 270);
      distance = this.randomElement(distances);
      point = geolib.computeDestinationPoint(point, distance, bearing);
      points.push(point);
    }

    return points.map(p => ({latitude: p.latitude, longitude: p.longitude}));
  }
}
