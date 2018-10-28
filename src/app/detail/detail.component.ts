import {Component, Input, OnInit} from '@angular/core';
import {BlockService} from '../block.service';
import {Property} from '../../../contracts/src/property';
import {CreatePropertyRequest} from '../../../contracts/src/create.property.request';
import {MatDialog} from '@angular/material';
import {ProgressComponent} from '../progress/progress.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  title = 'Create a boundary';

  @Input()
  property: CreatePropertyRequest;

  constructor(private blockService: BlockService, private dialog: MatDialog) {
  }

  async onSubmit() {
    const progress = this.dialog.open(ProgressComponent);
    progress.disableClose = true;
    try {
      console.log('Creating new property');
      const result = await this.blockService.createProperty(this.property);
      console.log(result);
      if (result.returnCode === 'Failure') {
        alert(result.info.peerErrors[0].errMsg);
        throw new Error('Failed to create property');
      } else {
        console.log('Created new property');
        this.property = null;
      }

    } finally {
      progress.close();
    }

  }

  ngOnInit() {
  }

}
