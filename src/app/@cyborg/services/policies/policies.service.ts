import {Injectable} from '@angular/core';
import {CrudService} from '../crud/crud.service';
import {Observable, combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PoliciesService extends CrudService {
    endpoint = 'policies';

    public calendar(): Observable<any> {
        return new Observable((subscriber) => {
            const params = {};
            this.http.get('/api/v1/' + this.endpoint + '/', params).subscribe({
                next: (result: any) => {
                    const policiesCalendar = [];
                    for (const el of result.results) {
                        policiesCalendar.push(this.http.get(el.related.calendar, params).pipe(map((res: any) => ({
                            name: el.name,
                            enabled: el.enabled && el.summary_fields.schedule.enabled
                                && el.summary_fields.repository.enabled,
                            schedules: res
                        }))));
                    }
                    combineLatest(policiesCalendar).subscribe((res) => {
                        subscriber.next(res);
                    });
                },
                error: (error) => {
                    subscriber.error(error);
                }
            });
        });
    }

    public count(): Observable<any> {
        return new Observable((subscriber) => {
            const params = {};
            this.http.get('/api/v1/' + this.endpoint + '/', params).subscribe({
                next: (result: any) => {
                    subscriber.next(result.count);
                },
                error: (error) => {
                    subscriber.error(error);
                }
            });
        });
    }

    public moduleItems(module, client, data = null): Observable<any> {
        if (data) {
            return new Observable((subscriber) => {
                this.http.post('/api/v1/' + this.endpoint + '/module/' + module + '/' + client + '/',
                    data, {observe: 'response'}).subscribe({
                    next: (result: any) => {
                        subscriber.next(result);
                    },
                    error: (error) => {
                        subscriber.error(error);
                    }
                });
            });
        } else {
            return new Observable((subscriber) => {
                this.http.get('/api/v1/' + this.endpoint + '/module/' + module + '/' + client + '/',
                    {observe: 'response'}).subscribe({
                    next: (result: any) => {
                        subscriber.next(result);
                    },
                    error: (error) => {
                        subscriber.error(error);
                    }
                });
            });
        }
    }

    public launch(id): Observable<any> {
        return new Observable((subscriber) => {
            const params = {
                verbosity: 0,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                extra_vars: {}
            };
            this.http.post('/api/v1/' + this.endpoint + '/' + id + '/launch/', params).subscribe({
                next: (res: any) => {
                    subscriber.next(res);
                },
                error: (error) => {
                    subscriber.error(error);
                }
            });
        });
    }
}
