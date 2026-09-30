import { Component } from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
  imports: [MatButtonModule, MatIconModule],
  selector: 'app-navbar-panel',
  styleUrl: './navbar-panel.scss',
  templateUrl: './navbar-panel.html',
})
export class NavbarPanel {}
