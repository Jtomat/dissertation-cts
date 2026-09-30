import { Component, inject, OnInit } from '@angular/core';
import { CoreApiService } from '@app/services/core-api.service';
import { catchError } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [MatIconModule, MatButtonModule],
  selector: 'app-title-bar',
  styleUrl: './title-bar.component.scss',
  templateUrl: './title-bar.component.html',
})
export class TitleBarComponent implements OnInit {
  coreReady = false;
  coreStatus = 'Подключение...';
  projectName = '';
  workspace = '';

  protected readonly coreApi = inject(CoreApiService);
  ngOnInit() {
    this.refresh();
  }

  minimize(): void {
    window.desktopAPI.minimize();
  }

  maximize(): void {
    window.desktopAPI.maximize();
  }

  close(): void {
    window.desktopAPI.close();
  }

  refresh(): void {
    this.coreApi
      .getState()
      .pipe(
        catchError((e) => {
          this.coreReady = false;
          this.coreStatus = 'Недоступно';
          return e;
        }),
      )
      .subscribe((state) => {
        this.coreReady = true;
        this.coreStatus = state.core;
        this.projectName = state.project;
        this.workspace = state.workspace;
      });
  }
}
