import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InsideWindow } from './components/inside-window/inside-window';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, InsideWindow],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'myhomeIndex';
}
