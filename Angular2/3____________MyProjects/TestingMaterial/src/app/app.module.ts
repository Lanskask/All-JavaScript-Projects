import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MatModuleModule } from './matmodule/matmodule.module';
import { GetDataService } from './services/getdata.service';
import { RavilComponent } from './src/app/ravil/ravil.component';

@NgModule({
  declarations: [
    AppComponent,
    RavilComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatModuleModule
  ],
  providers: [GetDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
