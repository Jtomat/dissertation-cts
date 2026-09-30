import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TitleBarComponent} from "@app/core/title-bar/title-bar.component";
import {NavbarPanel} from "@app/core/navbar-panel/navbar-panel";

@Component({
  imports: [RouterOutlet, TitleBarComponent, NavbarPanel],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('ui');
}
