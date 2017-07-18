import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk';
import { MdPaginator } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import { COLORS } from './potso/COLORS';
import { NAMES } from './potso/NAMES';
import { UserData } from './potso/UserData';
import { ExampleDatabase } from './potso/ExampleDatabase';
import { ExampleDataSource } from './potso/ExampleDataSource';

@Component({
  selector: 'app-data-tabl-exampl',
  templateUrl: './data-table-exampl2.component.html',
  styleUrls: ['./data-tabl-exampl.component.css']
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