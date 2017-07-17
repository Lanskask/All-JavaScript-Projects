import { Component, OnInit } from '@angular/core';
import { GetDataService } from '../../services/getdata.service';
import { dsOrder } from '../../potso/dsOrder';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  public allDsOrder: dsOrder;

  constructor(private _getDataService: GetDataService) { }

  ngOnInit() {
    this.getAllDsOrder();
  }

  getAllDsOrder() {
    this.allDsOrder = this._getDataService.allDsOrder;
  }

}