import {Component, Input, OnInit} from '@angular/core';
import {BlockService} from '../block.service';
import {Property} from '../../../contracts/src/property';
import {CreatePropertyRequest} from '../../../contracts/src/create.property.request';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  title = 'Create a boundary';

  @Input()
  property: CreatePropertyRequest;

  constructor(private blockService: BlockService) {
  }

  async onSubmit() {
    await this.blockService.createProperty(this.property);
  }

  ngOnInit() {
  }

}
