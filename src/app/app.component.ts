import {Component, OnInit} from '@angular/core';
import {LatLngLiteral} from '@agm/core';
import {AuthenticationService} from './authentication.service';
import * as geolib from 'geolib';
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

  constructor(private authService: AuthenticationService) {
  }

  ngOnInit(): void {
    window.navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.paths = this.generateRandomCoordinates(position);
      this.zoom = 20;
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
    while (bearing < 359) {
      bearing += Math.min(this.randomElement(angles), 300);
      distance = this.randomElement(distances);
      point = geolib.computeDestinationPoint(point, distance, bearing);
      points.push(point);
    }

    return points.map(p => ({lat: p.latitude, lng: p.longitude}));


  }

}
