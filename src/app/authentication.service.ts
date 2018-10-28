import { Injectable } from '@angular/core';
import {UsernamePasswordCredentials} from './username.password.credentials';
import {MatDialog} from '@angular/material';
import {CredentialsComponent} from './credentials/credentials.component';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  credentialsKey: string;
  constructor(private dialog: MatDialog, private httpClient: HttpClient) {
    this.credentialsKey = 'oracleCreds';
  }

  async requestCredentials(): Promise<UsernamePasswordCredentials> {
    if (localStorage.getItem(this.credentialsKey)) {
      return JSON.parse(localStorage.getItem(this.credentialsKey));
    } else {
      const credentialsDialog = this.dialog.open(CredentialsComponent);
      const result = await credentialsDialog.afterClosed().toPromise() as UsernamePasswordCredentials;
      await this.validateCredentials(result);
      localStorage.setItem(this.credentialsKey, JSON.stringify(result));
      return result;
    }
  }

  toRequestHeaders(creds: UsernamePasswordCredentials): Record<string, string> {
    return {
      Authorization: `Basic ${btoa(creds.username + ':' + creds.password)}`
    };
  }

  async validateCredentials(creds: UsernamePasswordCredentials) {
    const response = await this.httpClient.get(`${environment.oracleEndpoint}/bcsgw/rest/version`, {
      headers: this.toRequestHeaders(creds)
    }).toPromise();
  }
}
