import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import {Form, FormsModule} from '@angular/forms';
import {MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatInputModule, MatToolbarModule} from '@angular/material';
import { CredentialsComponent } from './credentials/credentials.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  entryComponents: [
    CredentialsComponent
  ],
  declarations: [
    AppComponent,
    CredentialsComponent,
    DetailComponent
  ],
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatDialogModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAdFUBTh_ecpsU43nSL4vFNPm_TucF_6qA'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
