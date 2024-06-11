import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
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
                subscriber.error(error);
            });
        });
    }

    public patch(id: number, data: object): Observable<any> {
        return new Observable((subscriber) => {
            this.http.patch('/api/v1/' + this.endpoint + '/' + id + '/', data, {observe: 'response'}).subscribe((result: any) => {
                subscriber.next(result);
            }, (error) => {
                subscriber.error(error);
            });
        });
    }
}
