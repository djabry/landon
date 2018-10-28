import {Component, OnInit} from '@angular/core';
import {LatLngLiteral} from '@agm/core';
import {AuthenticationService} from './authentication.service';
import * as geolib from 'geolib';
import {Property} from '../../contracts/src/property';
import {CreatePropertyRequest} from '../../contracts/src/create.property.request';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Landon';
  lat = 51;
  lng = 0;
  zoom = 10;
  paths: LatLngLiteral[];
  oldPaths: Array<LatLngLiteral[]>;
  property: CreatePropertyRequest;

  constructor(private authService: AuthenticationService) {
  }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
  }

  ngOnInit(): void {
    window.navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.paths = this.generateRandomCoordinates(position);
      this.oldPaths = ([0]).map(() => this.generateRandomCoordinates(position));
      this.zoom = 20;
      const boundaryData = this.paths.map(l => ({latitude: l.lat, longitude: l.lng}));
      this.property = {
        propertyId: this.guid(),
        boundaryData: boundaryData,
        ownerId: this.guid(),
        ...geolib.getCenter(boundaryData),
      };
      this.authService.requestBlockchainCredentials();
    });

  }

  randomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  generateRandomCoordinates(start: Position): LatLngLiteral[] {
    let bearing = 0;
    let distance = 1;
    let point = {latitude: start.coords.latitude, longitude: start.coords.longitude};
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

    return points.map(p => ({lat: p.latitude, lng: p.longitude}));


  }

}
