import { Component, inject, signal, ViewContainerRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TitleBarComponent } from '@app/core/title-bar/title-bar.component';
import { NavbarPanel } from '@app/core/navbar-panel/navbar-panel';
import { OutputBarComponent } from '@app/core/output-bar/output-bar.component';
import { AngularSplitModule } from 'angular-split';

@Component({
  imports: [RouterOutlet, TitleBarComponent, NavbarPanel, OutputBarComponent, AngularSplitModule],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('ui');

  protected readonly vcr = inject(ViewContainerRef);
}
