import {Component, OnInit} from '@angular/core';
import {LatLngLiteral} from '@agm/core';
import {AuthenticationService} from './authentication.service';

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

  constructor(private authService: AuthenticationService) {
  }

  ngOnInit(): void {
    window.navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.zoom = 20;
    });
    this.authService.requestCredentials();
  }

}
