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

  generateRandomCoordinates(start: Position): LatLngLiteral[] {
    let bearing = 0;
    let distance = 1;
    let point = {latitude: start.coords.latitude, longitude: start.coords.longitude};
    const points = [
      point
    ];

    while (bearing < 359) {
      bearing += Math.round(Math.random() * 20);
      distance = Math.random() * 5;
      point = geolib.computeDestinationPoint(point, distance, bearing);
      points.push(point);
    }

    return points.map(p => ({lat: p.latitude, lng: p.longitude}));


  }

}
