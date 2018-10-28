import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {UsernamePasswordCredentials} from '../username.password.credentials';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss']
})
export class CredentialsComponent implements OnInit {

  hide: boolean;
  password: string;
  username: string;
  constructor(public ref: MatDialogRef<CredentialsComponent>) {

  }

  onSubmit() {
    if (this.username && this.password) {
      const creds: UsernamePasswordCredentials = {
        username: this.username,
        password: this.password
      };
      this.ref.close(creds);
    }

  }

  ngOnInit() {
  }

}
