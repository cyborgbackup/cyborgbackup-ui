import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {JobsService} from '../../services';
import {NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';

@Component({
  selector: 'cbg-job-result',
  templateUrl: './job-result.component.html',
  styleUrls: ['./job-result.component.scss']
})
export class JobResultComponent implements OnInit {
  private counter: any;
  public job: any;
  public jobId: number;
  public stdoutFullScreen: boolean = false;
  public localServer = localStorage.getItem('localServer') ? localStorage.getItem('localServer') : '';

  constructor(private route: ActivatedRoute,
              private jobsService: JobsService,
              private toastrService: NbToastrService) {
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
          if (this.job.status === 'running' ) {
            this.startCounter();
          }
        });
      }
    });
  }
  startCounter(): void {
    this.counter = setInterval (() => {
      console.log('Add elapsed');
      console.log(this.job.status);
      if (this.job.status !== 'running ') {
        clearInterval(this.counter);
      } else {
        this.job.elapsed += 1;
      }
    }, 1000);
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

  cancel(): void {
    this.jobsService.cancelJob(this.jobId).subscribe(data => {
      this.toastrService.show('', 'Job canceled', {
        position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
        status: 'success'
      });
    }, (err) => {
      this.toastrService.show(err, 'Cannot cancel this Job', {
        position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
        status: 'danger'
      });
    });
  }

  toggleStdoutFullscreen(): void {
    this.stdoutFullScreen = !this.stdoutFullScreen;
  }

  ngOnInit() {
  }

}
