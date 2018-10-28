import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {UsernamePasswordCredentials} from '../username.password.credentials';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss']
})
export class CredentialsComponent implements OnInit {

  title: string;
  password: string;
  username: string;
  hide = true;
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
