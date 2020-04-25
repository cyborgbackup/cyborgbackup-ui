import { Component, OnInit } from '@angular/core';
import { MENU_ITEMS } from './pages-menu';
import {WebsocketService} from '../websocket.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {NbToastrService} from '@nebular/theme';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit {
  destroyed$ = new Subject();
  menu = MENU_ITEMS;

  constructor(private websocketService: WebsocketService,
              private toastrService: NbToastrService) {
  }

  ngOnInit() {
    this.websocketService.connect().pipe(
        takeUntil(this.destroyed$)
    ).subscribe(messages => {
      if (messages.group_name === 'jobs' ) {
        if (parseInt(messages.job_id, 10)) {
          if (messages.status === 'running') {
            this.toastrService.primary('Backup job ' + messages.job_id + ' ' + messages.job_name + ' running');
          } else if (messages.status === 'successful' ) {
            this.toastrService.success('Backup job ' + messages.job_id + ' ' + messages.job_name + ' success');
          } else if ( messages.status === 'failed' || messages.status === 'error') {
            this.toastrService.warning('Backup job ' + messages.job_id + ' ' + messages.job_name + ' failed');
          }
        }
      }
    });
    this.websocketService.send({
      groups: {
        jobs: ['status_changed']
      },
    });
  }
}
