import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
    protected endpoint: string;

    constructor(public http: HttpClient) { }

    public options(): Observable<any> {
        return new Observable((subscriber) => {
            const params = {};
            this.http.options('/api/v1/' + this.endpoint + '/', params).subscribe((result: any) => {
                subscriber.next(result.actions);
            }, (error) => {
                // console.log('send query', error);
                subscriber.error(error);
            });
        });
    }

    public fetch(size= 100, page= 1, params = {}): Observable<any> {
        return new Observable((subscriber) => {
            params['page_size'] = size;
            params['page'] = page;
            this.http.get('/api/v1/' + this.endpoint + '/', params).subscribe((result: any) => {
                subscriber.next(result);
            }, (error) => {
              // console.log('send query', error);
              subscriber.error(error);
            });
          });
    }

    public get(id: number): Observable<any> {
        return new Observable((subscriber) => {
            const params = {};
            this.http.get('/api/v1/' + this.endpoint + '/' + id + '/', params).subscribe((result: any) => {
                subscriber.next(result);
            }, (error) => {
                // console.log('send query', error);
                subscriber.error(error);
            });
        });
    }

    public patch(id: number, data: object): Observable<any> {
        return new Observable((subscriber) => {
            this.http.patch('/api/v1/' + this.endpoint + '/' + id + '/', data).subscribe((result: any) => {
                subscriber.next(result);
            }, (error) => {
                // console.log('send query', error);
                subscriber.error(error);
            });
        });
    }

    public post(data: object): Observable<any> {
        return new Observable((subscriber) => {
            this.http.post('/api/v1/' + this.endpoint + '/', data).subscribe((result: any) => {
                subscriber.next(result);
            }, (error) => {
                // console.log('send query', error);
                subscriber.error(error);
            });
        });
    }

    public put(id: number, data: object): Observable<any> {
        return new Observable((subscriber) => {
            this.http.put('/api/v1/' + this.endpoint + '/' + id + '/', data).subscribe((result: any) => {
                subscriber.next(result);
            }, (error) => {
                // console.log('send query', error);
                subscriber.error(error);
            });
        });
    }

    public delete(id: number): Observable<any> {
        return new Observable((subscriber) => {
            this.http.delete('/api/v1/' + this.endpoint + '/' + id + '/').subscribe((result: any) => {
                subscriber.next(result);
            }, (error) => {
                // console.log('send query', error);
                subscriber.error(error);
            });
        });
    }
}
