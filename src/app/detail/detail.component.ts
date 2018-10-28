import { Component, OnInit } from '@angular/core';
import {BlockService} from '../block.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  title = 'Create a boundary';

  constructor(private blockService: BlockService) {
  }

  ngOnInit() {
  }

}
