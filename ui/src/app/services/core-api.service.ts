import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import {catchError, Observable} from "rxjs";

@Service()
export class CoreApiService {
  private readonly api = `${environment.api.root}`;
  protected readonly http = inject(HttpClient);

  getState(): Observable<any> {
    console.log(environment)
    return this.http.get<{
      project: string;
      core: string;
      workspace: string;
    }>(`${this.api}/state`).pipe(catchError(e=> {
      console.log(e)
      return e
    }));
  }

  readFile(path: string) {
    return this.http.post<{
      path: string;
      content: string;
    }>(`${this.api}/files/read`, { path });
  }
}