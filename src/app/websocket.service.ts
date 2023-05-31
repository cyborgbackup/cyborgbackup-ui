import { Injectable, OnDestroy } from '@angular/core';
import {Observable, of} from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { delay, retryWhen, switchMap } from 'rxjs/operators';

@Injectable()
export class WebsocketService implements OnDestroy {
  private connection$: WebSocketSubject<any>;
  private retrySeconds = 10;
  private protocol: string;
  private url: string;
  private host: string;

  constructor() {
    const usedServer: string = localStorage.getItem('localServer');
    if (usedServer !== '') {
      if (usedServer.indexOf('https:') >= 0) {
        this.protocol = 'wss';
      } else {
        this.protocol = 'ws';
      }
      this.host = usedServer.split('/')[2];
    } else {
      if (window.location.protocol === 'http:') {
        this.protocol = 'ws';
      }
      if (window.location.protocol === 'https:') {
        this.protocol = 'wss';
      }
      this.host = window.location.host;
    }
    const token = JSON.parse(localStorage.getItem('auth_app_token')).value;
    this.url = this.protocol + '://' + this.host + '/websocket/?token=' + token;
  }

  connect(): Observable<any> {
    return of(this.url).pipe(
        switchMap(wsUrl => {
          if (this.connection$) {
            return this.connection$;
          } else {
            this.connection$ = webSocket(wsUrl);
            return this.connection$;
          }
        }),
        retryWhen((errors) => errors.pipe(delay(this.retrySeconds)))
    );
  }

  send(data: any) {
    if (this.connection$) {
      this.connection$.next(data);
    } else {
      console.error('Did not send data, open a connection first');
    }
  }

  closeConnection() {
    if (this.connection$) {
      this.connection$.complete();
      this.connection$ = null;
    }
  }

  ngOnDestroy() {
    this.closeConnection();
  }
}
