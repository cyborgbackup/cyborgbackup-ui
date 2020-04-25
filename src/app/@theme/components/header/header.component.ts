import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {NbAuthJWTToken, NbAuthService} from '@nebular/auth';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  displayName: string = 'John Doe';

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'legacy',
      name: 'Legacy',
    }
  ];

  currentTheme: string;

  userMenu = [ { title: 'Profile', link: '/profile' },
    {title: 'Theme', children: [
        {title: 'Dark Theme' },
        {title: 'Light Theme'},
        {title: 'Legacy Theme'},
      ]},
    { title: 'Log out', link: '/auth/logout' } ];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private authService: NbAuthService) {
    this.currentTheme = localStorage.getItem('themeCyBorgBackup');
    this.authService.onTokenChange()
        .subscribe((token: NbAuthJWTToken) => {
          if (token.isValid()) {
            this.user = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable
            if (this.user.first_name !== '' || this.user.last_name !== '' ) {
              this.displayName = this.user.first_name + ' ' + this.user.last_name;
            }
          }
        });
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

    this.menuService.onItemClick().pipe(
        map(({ item }) => item),
        takeUntil(this.destroy$),
    ).subscribe(itemClick => {
      if (['Dark Theme', 'Legacy Theme', 'Light Theme'].indexOf(itemClick.title) >= 0) {
        let newTheme = '';
        if (itemClick.title === 'Dark Theme') {
          newTheme = 'dark';
        } else if (itemClick.title === 'Legacy Theme') {
            newTheme = 'legacy';
        } else {
          newTheme = 'default';
        }
        localStorage.setItem('themeCyBorgBackup', newTheme);
        this.changeTheme(newTheme);
        this.menuService.collapseAll();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
