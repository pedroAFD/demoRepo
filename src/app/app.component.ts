import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';

@Component({
  selector: 'app-root',
  imports: [SidemenuComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'my-material-app';
}
