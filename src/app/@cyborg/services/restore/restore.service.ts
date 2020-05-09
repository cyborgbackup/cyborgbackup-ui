import { Injectable } from '@angular/core';
import {CrudService} from '../crud/crud.service';

@Injectable({
  providedIn: 'root'
})
export class RestoreService extends CrudService {
  endpoint = 'restore';
}
