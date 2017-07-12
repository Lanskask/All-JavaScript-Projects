import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { A2DtComponent } from './a2dt/a2dt.component';
import { A2DtModule } from './a2dt/a2dt.module';
import { NgxDtComponent } from './ngx-dt/ngx-dt.component';

@NgModule({
  imports: [
    BrowserModule,
    A2DtModule,
    // A2DtComponent
  ],
  providers: [],
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    NgxDtComponent,
    A2DtComponent
  ],
})
export class AppModule { }
