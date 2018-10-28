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

  async requestBlockchainCredentials(): Promise<UsernamePasswordCredentials> {
    if (localStorage.getItem(this.credentialsKey)) {
      const creds = JSON.parse(localStorage.getItem(this.credentialsKey)) as UsernamePasswordCredentials;
      try {
        await this.validateCredentials(creds);
        return creds;
      } catch (err) {
        localStorage.removeItem(this.credentialsKey);
        throw err;
      }
    } else {
      const credentialsDialog = this.dialog.open(CredentialsComponent);
      credentialsDialog.disableClose = true;
      credentialsDialog.componentInstance.title = 'Oracle Blockchain credentials';
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
    const response = await this.httpClient.get(`${environment.proxyEndpoint}/version`, {
      headers: this.toRequestHeaders(creds)
    }).toPromise();
  }
}
