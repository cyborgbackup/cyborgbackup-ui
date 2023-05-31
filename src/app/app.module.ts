/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './auth-guard.service';
import { WebsocketService } from './websocket.service';
import {
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
  NbThemeModule
} from '@nebular/theme';
import { DjangoPasswordAuthStrategy } from './@core/framework/auth/djangopassword/djangopassword-strategy';
import { HomeComponent } from './home/home.component';
import { TokenInterceptor } from './@cyborg/auth/token.interceptor';
import { ServerInterceptor } from './@cyborg/auth/server.interceptor';
import { NB_AUTH_TOKEN_INTERCEPTOR_FILTER } from '@nebular/auth';
import { CyborgModule } from './@cyborg/cyborg.module';
import { HttpXSRFInterceptor } from './@cyborg/auth/xsrf.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrftoken',
      headerName: 'X-CSRFToken',
    }),
    AppRoutingModule,
    CyborgModule,

    ThemeModule.forRoot(),

    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    CoreModule.forRoot(),
  ],
  providers: [
    AuthGuard,
    WebsocketService,
    DjangoPasswordAuthStrategy,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpXSRFInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerInterceptor,
      multi: true
    },
    {
      provide: NB_AUTH_TOKEN_INTERCEPTOR_FILTER,
      useValue: function (req) { return req.url.indexOf('/api/v1/') !== 0; },
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
