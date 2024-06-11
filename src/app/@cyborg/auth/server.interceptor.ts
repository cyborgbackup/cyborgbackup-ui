import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NbAuthService} from '@nebular/auth';

@Injectable()
export class ServerInterceptor implements HttpInterceptor {

    constructor(private injector: Injector) {
    }

    protected get authService(): NbAuthService {
        return this.injector.get(NbAuthService);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const currentServer = localStorage.getItem('localServer');
        if (req.url.startsWith('/api/v1/') && currentServer) {
            req = req.clone({
                url: currentServer + req.url
            });
            return next.handle(req);
        } else {
            return next.handle(req);
        }
    }
}
