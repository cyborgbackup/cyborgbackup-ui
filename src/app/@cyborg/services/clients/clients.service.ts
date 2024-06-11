import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CrudService} from '../crud/crud.service';

@Injectable({
    providedIn: 'root'
})
export class ClientsService extends CrudService {
    endpoint = 'clients';

    public count(): Observable<any> {
        return new Observable((subscriber) => {
            const params = {};
            this.http.get('/api/v1/' + this.endpoint + '/', params).subscribe((result: any) => {
                subscriber.next(result.count);
            }, (error) => {
                subscriber.error(error);
            });
        });
    }
}
