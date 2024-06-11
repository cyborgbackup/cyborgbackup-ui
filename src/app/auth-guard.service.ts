import {Injectable} from '@angular/core';
import {CanActivate, CanLoad, Router} from '@angular/router';
import {NbAuthService} from '@nebular/auth';
import {tap} from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

    constructor(private authService: NbAuthService, private router: Router) {
    }

    canActivate() {
        // canActive can return Observable<boolean>, which is exactly what isAuthenticated returns
        return this.authService.isAuthenticated()
            .pipe(
                tap(authenticated => {
                    if (!authenticated) {
                        // this.router.navigate(['auth/login']);
                        this.router.navigate(['welcome']);
                    }
                }),
            );
    }

    canLoad() {
        // canActive can return Observable<boolean>, which is exactly what isAuthenticated returns
        return this.authService.isAuthenticated()
            .pipe(
                tap(authenticated => {
                    if (!authenticated) {
                        // this.router.navigate(['auth/login']);
                        this.router.navigate(['welcome']);
                    }
                }),
            );
    }
}
