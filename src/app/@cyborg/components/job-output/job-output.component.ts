import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {JobsService} from '../../services';
import {takeUntil} from 'rxjs/operators';
import {WebsocketService} from '../../../websocket.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'cbg-job-output',
  templateUrl: './job-output.component.html',
  styleUrls: ['./job-output.component.scss']
})
export class JobOutputComponent implements OnInit {
  private jobId: number;
  private job: any;
  public events = [];
  pageSize = 100;
  pageToLoad = 1;
  loading = false;
  destroyed$ = new Subject();
  jobFinished = false;
  followEngaged = false;
  noMore = false;

  constructor(private route: ActivatedRoute,
              private jobsService: JobsService,
              private websocketService: WebsocketService) {
    this.route.paramMap.subscribe(params => {
      this.jobId = +params.get('id');
      this.jobsService.get(this.jobId).subscribe((res) => {
        this.job = res;
        this.startWebsocket();
        this.loadNext();
      });
    });
  }

  followToggleClicked(): void {
    this.followEngaged = !this.followEngaged;
  }

  relaunch(): void {
    console.log('Relaunch job');
  }

  loadNext(): void {
    if (this.job === undefined
        || this.loading
        || this.noMore
        || ['successful', 'failed', 'finished'].indexOf(this.job.status) === -1
    ) { return ; }
    this.loading = true;
    this.jobsService.getEvents(this.jobId, this.pageToLoad)
        .subscribe(nextEvents => {
          this.events.push(...nextEvents.results);
          this.loading = false;
          if (nextEvents.next) {
            this.pageToLoad++;
          } else {
            this.noMore = true;
          }
        });
  }

  startWebsocket(): void {
    if ( ['successful', 'failed', 'finished'].indexOf(this.job.status) === -1 ) {
      this.websocketService.connect().pipe(
          takeUntil(this.destroyed$)
      ).subscribe(messages => {
        console.log(messages);
        if ( messages.type === 'job_event' ) {
          this.events.splice(messages.counter - 1, 0, messages);
        }
      });
      this.websocketService.send({
        groups: {
          jobs: ['status_changed'],
          job_events: [String(this.jobId)]
        },
      });
    }
  }

  ngOnInit() {

  }
}
