import { Inject, Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import {NB_AUTH_TOKEN_INTERCEPTOR_FILTER, NbAuthService} from '@nebular/auth';

@Injectable()
export class ServerInterceptor implements HttpInterceptor {

    constructor(private injector: Injector,
                @Inject(NB_AUTH_TOKEN_INTERCEPTOR_FILTER) protected filter) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const currentServer = localStorage.getItem('localServer');
        if (!this.filter(req)) {
            req = req.clone({
                url: currentServer + req.url
            });
            return next.handle(req);
        } else {
            return next.handle(req);
        }
    }

    protected get authService(): NbAuthService {
        return this.injector.get(NbAuthService);
    }
}
