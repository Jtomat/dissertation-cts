import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TitleBarComponent} from "@app/core/title-bar/title-bar.component";

@Component({
  imports: [RouterOutlet, TitleBarComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('ui');
}
