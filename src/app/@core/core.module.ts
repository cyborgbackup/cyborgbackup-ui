import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  getDeepFromObject,
  NbAuthJWTToken,
  NbAuthModule,
} from '@nebular/auth';
import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { of as observableOf } from 'rxjs';

import { throwIfAlreadyLoaded } from './module-import-guard';
import {DjangoPasswordAuthStrategy} from './framework/auth/djangopassword/djangopassword-strategy';

export class NbSimpleRoleProvider extends NbRoleProvider {
  getRole() {
    // here you could provide any role based on any auth flow
    return observableOf('guest');
  }
}

export const NB_CORE_PROVIDERS = [
  ...NbAuthModule.forRoot({

    strategies: [
      DjangoPasswordAuthStrategy.setup({
        name: 'email',
        baseEndpoint: '',
        login: {
          endpoint: '/api/token/obtain/',
          redirect: {
            success: '/dashboard',
            failure: null,
          },
        },
        logout: {
          endpoint: '/api/logout/',
          method: 'get',
          redirect: {
            success: '/welcome',
            failure: null,
          },
        },
        requestPass: {
          endpoint: '/api/password_reset/',
          redirect: {
            success: '/welcome',
            failure: null,
          },
        },
        refreshToken: {
          endpoint: '/api/token/refresh/',
          redirect: {
            success: '/dashboard',
            failure: null,
          },
        },
        resetPass: {
          endpoint: '/api/password_reset/confirm/',
          resetPasswordTokenKey: 'token',
          method: 'post',
          redirect: {
            success: '/auth/login',
            failure: null,
          },
        },
        token: {
          class: NbAuthJWTToken,
          key: 'access', // this parameter tells where to look for the token
          getter: (module, res, options) => getDeepFromObject(res, options.token.key),
        },
      }),
    ],
  }).providers,

  NbSecurityModule.forRoot({
    accessControl: {
      guest: {
        view: '*',
      },
      user: {
        parent: 'guest',
        create: '*',
        edit: '*',
        remove: '*',
      },
    },
  }).providers,
  {
    provide: NbRoleProvider, useClass: NbSimpleRoleProvider,
  }
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    NbAuthModule,
  ],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}
