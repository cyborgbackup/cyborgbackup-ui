import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CrudService} from '../crud/crud.service';

@Injectable({
    providedIn: 'root'
})
export class SettingsService extends CrudService {
    endpoint = 'settings';

    public set(id: number, data: object): Observable<any> {
        return this.http.patch('/api/v1/' + this.endpoint + '/' + id + '/', data);
    }

    public isSshPrivateKeySet(): Observable<any> {
        return this.http.get('/api/v1/' + this.endpoint + '/generate_ssh/', {observe: 'response'});
    }

    public getSshPublicKey(): Observable<any> {
        return this.http.get('/api/v1/' + this.endpoint + '/get_ssh_publickey/');
    }

    public generateSshKey(data: object): Observable<any> {
        data['size'] = parseInt(data['size'], 10);
        return this.http.post('/api/v1/' + this.endpoint + '/generate_ssh/', data);
    }
}
