import { EventEmitter, inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Subscription, switchMap } from 'rxjs';
import { ProjectEvent, ProjectEventSide } from '@app/services/type';
import { environment } from '@env/environment';

@Service()
export class ProjectApiService {
  protected readonly uiEvent$ = new EventEmitter<ProjectEvent>();
  protected readonly serverEvent$ = new EventEmitter<ProjectEvent>();
  protected readonly api = `${environment.api.root}`;
  protected readonly dataStream$ = new EventEmitter<ProjectEvent>();
  protected readonly subscription$: Subscription;
  protected readonly http = inject(HttpClient);

  public readonly uiEventStream = this.uiEvent$.asObservable();
  public readonly serverEventStream = this.serverEvent$.asObservable();

  constructor() {
    this.subscription$ = this.dataStream$
      .pipe(
        switchMap((event) => {
          switch (event.target) {
            case ProjectEventSide.UI:
              return of(event);
            case ProjectEventSide.Server:
              return this.http.post<ProjectEvent>(`${this.api}/state`, event);
          }
        }),
      )
      .subscribe((event) => {
        switch (event.target) {
          case ProjectEventSide.UI:
            this.uiEvent$.emit(event);
            break;
          case ProjectEventSide.Server:
            this.serverEvent$.emit(event);
            break;
        }
      });
  }

  public emitEvent(event: ProjectEvent): void {
    this.dataStream$.emit(event);
  }
}