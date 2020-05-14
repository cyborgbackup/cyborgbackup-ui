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
      if (this.jobId !== 0) {
        this.jobsService.get(this.jobId).subscribe((res) => {
          this.job = res;
        });
      }
    });
  }

  downloadLog(): void {
    this.jobsService.getReport(this.jobId).subscribe(data => {
      const blob = new Blob([data], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = this.jobId + '.log';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove(); // remove the element
    });
  }

  toggleStdoutFullscreen(): void {
    this.stdoutFullScreen = !this.stdoutFullScreen;
  }

  ngOnInit() {
  }

}
