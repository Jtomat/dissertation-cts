import { Component, inject } from '@angular/core';
import { CoreApiService } from '@app/services/core-api.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TitleBarMenuItem } from '@app/shared/title-bar-menu/types';
import { MatMenuModule } from '@angular/material/menu';
import {TitleBarMenuComponent} from "@app/shared/title-bar-menu/title-bar-menu.component";

@Component({
  imports: [MatIconModule, MatButtonModule, MatMenuModule, TitleBarMenuComponent],
  selector: 'app-title-bar',
  styleUrl: './title-bar.component.scss',
  templateUrl: './title-bar.component.html',
})
export class TitleBarComponent {
  protected readonly coreApi = inject(CoreApiService);
  protected readonly navBarItems: TitleBarMenuItem = {
    label: 'File',
  };

  minimize(): void {
    window.desktopAPI.minimize();
  }

  maximize(): void {
    window.desktopAPI.maximize();
  }

  close(): void {
    window.desktopAPI.close();
  }
}
