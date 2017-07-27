import { Component, ViewChild, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import {
    GridComponent,
    GridDataResult,
    DataStateChangeEvent,
    State
 } from '@progress/kendo-angular-grid';

// Include progress JSDO module
import a = require('./progress/progress');
let progress: any = a.progress;

import { CategoriesService } from './categories.service';

@Component({
  providers: [CategoriesService],
  selector: 'my-app',
  templateUrl: 'app.component.html',
})
export class AppComponent {
    private view: Observable<GridDataResult>;
    private pageSize: number = 5;
    private skip: number  = 0;

    @ViewChild(GridComponent) private grid: GridComponent;
    constructor(private service: CategoriesService) {
        this.view = service;

        this.service.query({ skip: this.skip, take: this.pageSize });
    }

    public ngAfterViewInit(): void {
        this.grid.dataStateChange
            .do(({ skip, take }: DataStateChangeEvent) => {
                this.skip = skip;
                this.pageSize = take;
            })
            .subscribe(x => this.service.query(x));
    }
}
