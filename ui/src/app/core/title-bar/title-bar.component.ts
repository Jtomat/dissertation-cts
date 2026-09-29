import {Component, inject, OnInit} from '@angular/core';
import {CoreApiService} from "@app/services/core-api.service";
import {catchError} from "rxjs";

@Component({
  imports: [],
  selector: 'app-title-bar',
  styleUrl: './title-bar.component.scss',
  templateUrl: './title-bar.component.html',
})
export class TitleBarComponent implements OnInit {
  coreReady = false;
  coreStatus = 'Подключение...';
  projectName = '';
  workspace = '';

  protected readonly coreApi = inject(CoreApiService)
  ngOnInit() {
    this.refresh();
  }

  minimize() {
    window.desktop.window.minimize();
  }

  maximize() {
    window.desktop.window.maximize();
  }

  close() {
    window.desktop.window.close();
  }

  refresh() {
    this.coreApi.getState().pipe(catchError(e=> {
      this.coreReady = false;
      this.coreStatus = 'Недоступно';
      return e;
    })).subscribe((state) => {
      this.coreReady = true;
      this.coreStatus = state.core;
      this.projectName = state.project;
      this.workspace = state.workspace;
    });
  }
}
