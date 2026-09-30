import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  imports: [MatButtonModule, MatMenuModule],
  selector: 'app-menu',
  styleUrl: './menu.component.scss',
  templateUrl: './menu.component.html',
})
export class MenuComponent {}
