import {Injectable} from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class HttpXSRFInterceptor implements HttpInterceptor {

    constructor() {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const respHeaderName = 'X-CSRFToken';
        const token = localStorage.getItem('csrftoken') as string;
        if (token !== null && !req.headers.has(respHeaderName)
            && req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
            let newHeaders = req.headers.set(respHeaderName, token);
            newHeaders = newHeaders.set('Cookie', 'csrftoken=' + token);
            req = req.clone({headers: newHeaders});
        }
        return next.handle(req);
    }
}
