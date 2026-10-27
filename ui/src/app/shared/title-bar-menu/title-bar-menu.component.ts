import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TitleBarMenuItem } from '@app/shared/title-bar-menu/types';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatButtonModule, MatMenuModule, MatIconModule],
  selector: 'app-title-bar-menu',
  styleUrl: './title-bar-menu.component.scss',
  templateUrl: './title-bar-menu.component.html',
})
export class TitleBarMenuComponent {
  public readonly dataItem = input.required<TitleBarMenuItem>();
}
