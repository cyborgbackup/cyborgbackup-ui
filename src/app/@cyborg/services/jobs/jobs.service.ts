import { Injectable } from '@angular/core';
import {CrudService} from '../crud/crud.service';
import {Observable} from 'rxjs';

export interface Job {
  id: number;
  type: string;
  url: string;
  related: any;
  summary_fields: any;
  created: string;
  modified: string;
  name: string;
  created_by: number;
  modified_by: number;
  launch_type: string;
  status: string;
  policy: number;
  failed: boolean;
  started: string;
  finished: string;
  elapsed: number;
  job_args: string;
  original_size: number;
  compressed_size: number;
  deduplicated_size: number;
  archive_name: string;
  job_cwd: string;
  job_env: string;
  job_explanation: string;
  client: number;
  repository: number;
  dependent_jobs: number;
  result_traceback: string;
  event_processing_finished: boolean;
  job_type: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobsService extends CrudService {
  endpoint = 'jobs';

  public getEvents(jobId: number, page: number): Observable<any> {
    return new Observable((subscriber) => {
      this.http.get('/api/v1/job_events/', {
        responseType: 'json',
        params: {
          job: String(jobId),
          order: 'counter',
          page: String(page)
        }
      }).subscribe((result: any) => {
        subscriber.next(result);
      }, (error) => {
        subscriber.error(error);
      });
    });
  }

  public getReport(jobId: number): Observable<any> {
    return new Observable((subscriber) => {
      this.http.get('/api/v1/jobs/' + jobId + '/stdout/?format=txt_download', {responseType: 'text'}).subscribe((result: any) => {
        subscriber.next(result);
      }, (error) => {
        subscriber.error(error);
      });
    });
  }

  public count(params = {}): Observable<any> {
    return new Observable((subscriber) => {
      this.http.get('/api/v1/' + this.endpoint + '/', params).subscribe((result: any) => {
        subscriber.next(result.count);
      }, (error) => {
        // console.log('send query', error);
        subscriber.error(error);
      });
    });
  }
}
