import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable, tap } from 'rxjs';

interface Size {
  width: number;
  height: number;
}

type SizesCache = Record<string, Size>

@Service()
export class UIConfigApiService {
  protected sizes: SizesCache = {};
  protected readonly http = inject(HttpClient);
  protected readonly api = `${environment.api.root}`;

  public loadSizes(): Observable<SizesCache> {
    return this.http.get<SizesCache>(`${this.api}/config/sizes`).pipe(
      tap((sizes) => {
        this.sizes = sizes;
      }),
    );
  }

  public updateSize(key: string, size: Size): void {
      this.sizes[key] = size;
      void this.http.post(`${this.api}/config/sizes`, {
        ...this.sizes
      })
    //
  }

  public getSize(key: string): Size {
    return this.sizes[key];
  }
}