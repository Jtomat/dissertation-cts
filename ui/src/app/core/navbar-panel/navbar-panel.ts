import {Component, inject} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {Router} from "@angular/router";

export interface NavbarPanelItem {
  title:string;
  icon:string;
  route:string;
  subMenu: any;
}

@Component({
  imports: [MatButtonModule, MatIconModule],
  selector: 'app-navbar-panel',
  styleUrl: './navbar-panel.scss',
  templateUrl: './navbar-panel.html',
})
export class NavbarPanel {
  protected router = inject(Router);

  isActive(path: string): boolean {
     return this.router.url.includes(path);
  }

  reroute(path: string): void {
    void this.router.navigate([path]);
  }
}
