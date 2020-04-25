import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CrudService} from '../crud/crud.service';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService extends CrudService {
  endpoint = 'schedules';
}
