import {Inject, Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {NB_AUTH_TOKEN_INTERCEPTOR_FILTER, NbAuthService, NbAuthToken} from '@nebular/auth';
// import { NbAuthToken } from '../token/token';
// import { NbAuthService } from '../auth.service';
// import { NB_AUTH_TOKEN_INTERCEPTOR_FILTER } from '../../auth.options';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private injector: Injector,
                @Inject(NB_AUTH_TOKEN_INTERCEPTOR_FILTER) protected filter) {
    }

    protected get authService(): NbAuthService {
        return this.injector.get(NbAuthService);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes('/api/v1/')) {
            return this.authService.isAuthenticatedOrRefresh()
                .pipe(
                    switchMap((authenticated) => {
                        if (authenticated) {
                            return this.authService.getToken().pipe(
                                switchMap((token: NbAuthToken) => {
                                    const JWT = `Bearer ${token.getValue()}`;
                                    req = req.clone({
                                        setHeaders: {
                                            // eslint-disable-next-line @typescript-eslint/naming-convention
                                            Authorization: JWT,
                                        },
                                    });
                                    return next.handle(req);
                                }),
                            );
                        } else {
                            return next.handle(req);
                        }
                    }),
                );
        } else {
            return next.handle(req);
        }
    }
}
