import { Injectable } from '@angular/core';
import {CrudService} from '../crud/crud.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PoliciesService extends CrudService {
  endpoint = 'policies';

  public calendar(): Observable<any> {
    return new Observable((subscriber) => {
      const params = {};
      this.http.get('/api/v1/' + this.endpoint + '/', params).subscribe((result: any) => {
        const policiesCalendar = [];
        for (const el of result.results ) {
          policiesCalendar.push(this.http.get(el.related.calendar, params).map((res: any) => {
            return {
              name: el.name,
                enabled: el.enabled && el.summary_fields.schedule.enabled && el.summary_fields.repository.enabled,
                schedules: res
            };
          }));
        }
        Observable.combineLatest(policiesCalendar).subscribe((res) => {
          subscriber.next(res);
        });
      }, (error) => {
        // console.log('send query', error);
        subscriber.error(error);
      });
    });
  }

  public count(): Observable<any> {
    return new Observable((subscriber) => {
      const params = {};
      this.http.get('/api/v1/' + this.endpoint + '/', params).subscribe((result: any) => {
        subscriber.next(result.count);
      }, (error) => {
        // console.log('send query', error);
        subscriber.error(error);
      });
    });
  }
}
