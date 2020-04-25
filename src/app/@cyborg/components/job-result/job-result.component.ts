import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {JobsService} from '../../services';

@Component({
  selector: 'cbg-job-result',
  templateUrl: './job-result.component.html',
  styleUrls: ['./job-result.component.scss']
})
export class JobResultComponent implements OnInit {
  public job: any;
  public jobId: number;
  public stdoutFullScreen: boolean = false;
  public localServer = localStorage.getItem('localServer') ? localStorage.getItem('localServer') : '';

  constructor(private route: ActivatedRoute,
              private jobsService: JobsService) {
    this.job = {
      summary_fields: {
        policy: {},
        client: {},
        repository: {},
        schedule: {}
      }
    };
    this.route.paramMap.subscribe(params => {
      this.jobId = +params.get('id');
      console.log(this.jobId);
      if (this.jobId !== 0) {
        this.jobsService.get(this.jobId).subscribe((res) => {
          this.job = res;
        });
      }
    });
  }

  toggleStdoutFullscreen(): void {
    this.stdoutFullScreen = !this.stdoutFullScreen;
  }

  ngOnInit() {
  }

}
