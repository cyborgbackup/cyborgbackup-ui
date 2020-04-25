import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CrudService} from '../crud/crud.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends CrudService {
  endpoint = 'users';


  public me(): Observable<any> {
    return new Observable((subscriber) => {
      const params = {};
      this.http.get('/api/v1/me/', params).subscribe((result: any) => {
        subscriber.next(result.results[0]);
      }, (error) => {
        // console.log('send query', error);
        subscriber.error(error);
      });
    });
  }
}
