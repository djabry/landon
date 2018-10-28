import {Component, OnInit} from '@angular/core';
import {LatLngLiteral} from '@agm/core';
import {AuthenticationService} from './authentication.service';
import * as geolib from 'geolib';
import {CreatePropertyRequest} from '../../contracts/src/create.property.request';
import {RandomPolygonGenerator} from './random.polygon.generator';
import {GeoCoordinate} from '../../contracts/src/geo.coordinate';
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

  constructor(private authService: AuthenticationService, private polygonGen: RandomPolygonGenerator) {
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

      this.initialise({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    }, fail => {
      this.initialise();
    });

  }

  async initialise(position: GeoCoordinate = {
    latitude: 51.519186600000005,
    longitude: -0.0874596
  }) {

    this.lat = position.latitude;
    this.lng = position.longitude;
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


  }

  generateRandomCoordinates(position: GeoCoordinate): LatLngLiteral[] {
    return this.polygonGen
      .generatePolygon(position)
      .map(l => ({lat: l.latitude, lng: l.longitude}));


  }

}
