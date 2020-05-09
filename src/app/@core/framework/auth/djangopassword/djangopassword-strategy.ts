/**
 * @license
 * Copyright CyBorgBackup. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpXsrfTokenExtractor} from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import {
    NbAuthIllegalTokenError,
    NbAuthResult,
    NbAuthStrategy,
    NbAuthStrategyClass,
    NbPasswordAuthStrategyOptions,
    passwordStrategyOptions,
} from '@nebular/auth';

/**
 * The most common authentication provider for email/password strategy.
 *
 * Strategy settings. Note, there is no need to copy over the whole object to change the settings you need.
 * Also, this.getOption call won't work outside of the default options declaration
 * (which is inside of the `NbPasswordAuthStrategy` class), so you have to replace it with a custom helper function
 * if you need it.
 *
 * ```ts
 *export class NbPasswordAuthStrategyOptions extends NbAuthStrategyOptions {
 *  name: string;
 *  baseEndpoint? = '/api/auth/';
 *  login?: boolean | NbPasswordStrategyModule = {
 *    alwaysFail: false,
 *    endpoint: 'login',
 *    method: 'post',
 *    requireValidToken: true,
 *    redirect: {
 *      success: '/',
 *      failure: null,
 *    },
 *    defaultErrors: ['Login/Email combination is not correct, please try again.'],
 *    defaultMessages: ['You have been successfully logged in.'],
 *  };
 *  register?: boolean | NbPasswordStrategyModule = {
 *    alwaysFail: false,
 *    endpoint: 'register',
 *    method: 'post',
 *    requireValidToken: true,
 *    redirect: {
 *      success: '/',
 *      failure: null,
 *    },
 *    defaultErrors: ['Something went wrong, please try again.'],
 *    defaultMessages: ['You have been successfully registered.'],
 *  };
 *  requestPass?: boolean | NbPasswordStrategyModule = {
 *    endpoint: 'request-pass',
 *    method: 'post',
 *    redirect: {
 *      success: '/',
 *      failure: null,
 *    },
 *    defaultErrors: ['Something went wrong, please try again.'],
 *    defaultMessages: ['Reset password instructions have been sent to your email.'],
 *  };
 *  resetPass?: boolean | NbPasswordStrategyReset = {
 *    endpoint: 'reset-pass',
 *    method: 'put',
 *    redirect: {
 *      success: '/',
 *      failure: null,
 *    },
 *    resetPasswordTokenKey: 'reset_password_token',
 *    defaultErrors: ['Something went wrong, please try again.'],
 *    defaultMessages: ['Your password has been successfully changed.'],
 *  };
 *  logout?: boolean | NbPasswordStrategyReset = {
 *    alwaysFail: false,
 *    endpoint: 'logout',
 *    method: 'delete',
 *    redirect: {
 *      success: '/',
 *      failure: null,
 *    },
 *    defaultErrors: ['Something went wrong, please try again.'],
 *    defaultMessages: ['You have been successfully logged out.'],
 *  };
 *  refreshToken?: boolean | NbPasswordStrategyModule = {
 *    endpoint: 'refresh-token',
 *    method: 'post',
 *    requireValidToken: true,
 *    redirect: {
 *      success: null,
 *      failure: null,
 *    },
 *    defaultErrors: ['Something went wrong, please try again.'],
 *    defaultMessages: ['Your token has been successfully refreshed.'],
 *  };
 *  token?: NbPasswordStrategyToken = {
 *    class: NbAuthSimpleToken,
 *    key: 'data.token',
 *    getter: (module: string, res: HttpResponse<Object>, options: NbPasswordAuthStrategyOptions) => getDeepFromObject(
 *      res.body,
 *      options.token.key,
 *    ),
 *  };
 *  errors?: NbPasswordStrategyMessage = {
 *    key: 'data.errors',
 *    getter: (module: string, res: HttpErrorResponse, options: NbPasswordAuthStrategyOptions) => getDeepFromObject(
 *      res.error,
 *      options.errors.key,
 *      options[module].defaultErrors,
 *    ),
 *  };
 *  messages?: NbPasswordStrategyMessage = {
 *    key: 'data.messages',
 *    getter: (module: string, res: HttpResponse<Object>, options: NbPasswordAuthStrategyOptions) => getDeepFromObject(
 *      res.body,
 *      options.messages.key,
 *      options[module].defaultMessages,
 *    ),
 *  };
 *  validation?: {
 *    password?: {
 *      required?: boolean;
 *      minLength?: number | null;
 *      maxLength?: number | null;
 *      regexp?: string | null;
 *    };
 *    email?: {
 *      required?: boolean;
 *      regexp?: string | null;
 *    };
 *    fullName?: {
 *      required?: boolean;
 *      minLength?: number | null;
 *      maxLength?: number | null;
 *      regexp?: string | null;
 *    };
 *  };
 *}
 * ```
 */
@Injectable()
export class DjangoPasswordAuthStrategy extends NbAuthStrategy {

    protected defaultOptions: NbPasswordAuthStrategyOptions = passwordStrategyOptions;

    static setup(options: NbPasswordAuthStrategyOptions): [NbAuthStrategyClass, NbPasswordAuthStrategyOptions] {
        return [DjangoPasswordAuthStrategy, options];
    }

    constructor(protected http: HttpClient, private route: ActivatedRoute,
                private cookieExtractor: HttpXsrfTokenExtractor) {
        super();
    }

    protected registerServer(server): void {
        let servers = JSON.parse(localStorage.getItem('cyborgServers'));
        if (servers !== null && typeof servers === 'object' && servers.indexOf(server) === -1 ) {
            servers.push(server);
        } else {
            servers = [server];
        }
        localStorage.setItem('localServer', server);
        localStorage.setItem('cyborgServers', JSON.stringify(servers));
    }

    authenticate(data?: any): Observable<NbAuthResult> {
        const module = 'login';
        let url = this.getActionEndpoint(module);
        let loginUrl = '/api/login/';
        if (data.hasOwnProperty('server')) {
            url = data.server + url;
            loginUrl = data.server + loginUrl;
        }
        const httpOptions = {
            headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*'})
        };
        const requireValidToken = this.getOption(`${module}.requireValidToken`);
        return new Observable<NbAuthResult>((subscriber) => {
            this.http.get(loginUrl, {responseType: 'text', observe: 'response'}).subscribe((resget: any) => {
                const csrfmiddlewaretoken = /name="csrfmiddlewaretoken" value="([0-9a-zA-Z]+)"/.exec(resget.body)[1];
                localStorage.setItem('csrftoken', csrfmiddlewaretoken);
                this.http.post(url, data, httpOptions).subscribe((res: any) => {
                    this.registerServer(data.server);
                    subscriber.next(new NbAuthResult(
                        true,
                        res,
                        this.getOption(`${module}.redirect.success`),
                        [],
                        this.getOption('messages.getter')(module, res, this.options),
                        this.createToken(this.getOption('token.getter')(module, res, this.options), requireValidToken)));
                }, (error) => {
                    let errors = [];
                    if (error instanceof HttpErrorResponse) {
                        errors = this.getOption('errors.getter')(module, error, this.options);
                    } else if (error instanceof NbAuthIllegalTokenError) {
                        errors.push(error.message);
                    } else {
                        errors.push('Something went wrong.');
                    }
                    subscriber.next(new NbAuthResult(
                        false,
                        error,
                        this.getOption(`${module}.redirect.failure`),
                        errors,
                    ));
                });
            });
        });
    }

    requestPassword(data?: any): Observable<NbAuthResult> {
        const module = 'requestPass';
        const method = this.getOption(`${module}.method`);
        let url = this.getActionEndpoint(module);
        if (data.hasOwnProperty('server')) {
            url = data.server + url;
        }
        return this.http.request(method, url, {body: data, observe: 'response'})
            .pipe(
                map((res) => {
                    if (this.getOption(`${module}.alwaysFail`)) {
                        throw this.createFailResponse();
                    }

                    return res;
                }),
                map((res) => {
                    return new NbAuthResult(
                        true,
                        res,
                        this.getOption(`${module}.redirect.success`),
                        [],
                        this.getOption('messages.getter')(module, res, this.options));
                }),
                catchError((res) => {
                    return this.handleResponseError(res, module);
                }),
            );
    }

    resetPassword(data: any = {}): Observable<NbAuthResult> {
        const module = 'resetPass';
        const method = this.getOption(`${module}.method`);
        let url = this.getActionEndpoint(module);
        const tokenKey = this.getOption(`${module}.resetPasswordTokenKey`);
        if (data.hasOwnProperty('server')) {
            url = data.server + url;
        }
        console.log(tokenKey);
        console.log(this.route.snapshot);
        console.log(this.route.snapshot.queryParams[tokenKey]);
        data[tokenKey] = this.route.snapshot.queryParams[tokenKey];
        return this.http.request(method, url, {body: data, observe: 'response'})
            .pipe(
                map((res) => {
                    if (this.getOption(`${module}.alwaysFail`)) {
                        throw this.createFailResponse();
                    }

                    return res;
                }),
                map((res) => {
                    return new NbAuthResult(
                        true,
                        res,
                        this.getOption(`${module}.redirect.success`),
                        [],
                        this.getOption('messages.getter')(module, res, this.options));
                }),
                catchError((res) => {
                    return this.handleResponseError(res, module);
                }),
            );
    }

    logout(): Observable<NbAuthResult> {

        const module = 'logout';
        const method = this.getOption(`${module}.method`);
        let url = this.getActionEndpoint(module);
        if (localStorage.getItem('localServer') !== '') {
            url = localStorage.getItem('localServer') + url;
        }
        return observableOf({})
            .pipe(
                switchMap((res: any) => {
                    if (!url) {
                        return observableOf(res);
                    }
                    return this.http.request(method, url, {observe: 'response'});
                }),
                map((res) => {
                    if (this.getOption(`${module}.alwaysFail`)) {
                        throw this.createFailResponse();
                    }

                    return res;
                }),
                map((res) => {
                    return new NbAuthResult(
                        true,
                        res,
                        this.getOption(`${module}.redirect.success`),
                        [],
                        this.getOption('messages.getter')(module, res, this.options));
                }),
                catchError((res) => {
                    return this.handleResponseError(res, module);
                }),
            );
    }

    refreshToken(data?: any): Observable<NbAuthResult> {

        const module = 'refreshToken';
        const method = this.getOption(`${module}.method`);
        let url = this.getActionEndpoint(module);
        const requireValidToken = this.getOption(`${module}.requireValidToken`);
        if (localStorage.getItem('localServer') !== '') {
            url = localStorage.getItem('localServer') + url;
        }

        return this.http.request(method, url, {body: data, observe: 'response'})
            .pipe(
                map((res) => {
                    if (this.getOption(`${module}.alwaysFail`)) {
                        throw this.createFailResponse(data);
                    }

                    return res;
                }),
                map((res) => {
                    return new NbAuthResult(
                        true,
                        res,
                        this.getOption(`${module}.redirect.success`),
                        [],
                        this.getOption('messages.getter')(module, res, this.options),
                        this.createToken(this.getOption('token.getter')(module, res, this.options), requireValidToken));
                }),
                catchError((res) => {
                    return this.handleResponseError(res, module);
                }),
            );
    }

    register(): Observable<NbAuthResult> {
        return null;
    }

    protected handleResponseError(res: any, module: string): Observable<NbAuthResult> {
        let errors = [];
        if (res instanceof HttpErrorResponse) {
            errors = this.getOption('errors.getter')(module, res, this.options);
        } else if (res instanceof NbAuthIllegalTokenError) {
            errors.push(res.message);
        } else {
            errors.push('Something went wrong.');
        }
        return observableOf(
            new NbAuthResult(
                false,
                res,
                this.getOption(`${module}.redirect.failure`),
                errors,
            ));
    }

}
