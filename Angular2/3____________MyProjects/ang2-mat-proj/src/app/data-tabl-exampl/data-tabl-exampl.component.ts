import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';

import { COLORS } from './potso/COLORS';
import { NAMES } from './potso/NAMES';
import { UserData } from './potso/UserData';
import { ExampleDatabase } from './potso/ExampleDatabase';
import { ExampleDataSource } from './potso/ExampleDataSource';

@Component({
  selector: 'app-data-tabl-exampl',
  templateUrl: './data-tabl-exampl.component/data-table-exampl2.component.html',
  styleUrls: ['./data-tabl-exampl.component/data-tabl-exampl.component.css']
})
export class DataTablExamplComponent implements OnInit {

  displayedColumns = ['userId', 'userName', 'progress', 'color'];
  exampleDatabase = new ExampleDatabase();
  dataSource: ExampleDataSource | null;

  @ViewChild(MdPaginator) paginator: MdPaginator;

  ngOnInit() {
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator);
  }
}