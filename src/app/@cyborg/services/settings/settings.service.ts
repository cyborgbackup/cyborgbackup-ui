import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CrudService} from '../crud/crud.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService extends CrudService {
  endpoint = 'settings';

  public set(id: number, data: object): Observable<any> {
    return this.http.patch('/api/v1/' + this.endpoint + '/' + id + '/', data);
  }
}
