import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CrudService} from '../crud/crud.service';

@Injectable({
    providedIn: 'root'
})
export class StatsService extends CrudService {
    endpoint = 'stats';

    public fetch(): Observable<any> {
        return new Observable((subscriber) => {
            const params = {};
            this.http.get('/api/v1/' + this.endpoint + '/', params).subscribe((result: any) => {
                subscriber.next(result);
            }, (error) => {
                // console.log('send query', error);
                subscriber.error(error);
            });
        });
    }
}
