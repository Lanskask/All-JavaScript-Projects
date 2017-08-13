import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component/app.component.html',
  styleUrls: ['./app.component/app.component.css']
})
export class AppComponent {
  title = 'app';

  name = new FormControl();
}
