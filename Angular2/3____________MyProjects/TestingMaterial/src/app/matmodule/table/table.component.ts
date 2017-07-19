import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';

import { GetDataService } from '../../services/getdata.service';
import { dsOrder } from '../../potso/dsOrder';

@Component({
  selector: 'app-table',
  templateUrl: './table.component/table.component.html',
  styleUrls: ['./table.component/table.component.css']
})
export class TableComponent implements OnInit {

  public allDsOrder: dsOrder;

  constructor(private _getDataService: GetDataService, private _dialog: MdDialog) { }

  dblClickOnTable() {
    
  }

  ngOnInit() {
    this.getAllDsOrder();
  }

  getAllDsOrder() {
    this.allDsOrder = this._getDataService.allDsOrder;
  }

}