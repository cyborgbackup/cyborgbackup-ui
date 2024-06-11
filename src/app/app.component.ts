/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {Component, HostBinding, OnInit} from '@angular/core';
import {NbThemeService} from "@nebular/theme";

@Component({
    selector: 'ngx-app',
    template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
    @HostBinding('class')
    currentTheme: 'light-theme' | 'legacy-theme' | 'dark-theme' = 'light-theme';

    constructor(private themeService: NbThemeService) {
    }

    ngOnInit() {
        this.themeService.onThemeChange().subscribe(theme => {
            switch (theme.name) {
                case 'dark':
                    this.currentTheme = 'dark-theme';
                    break;
                case 'default':
                    this.currentTheme = 'light-theme';
                    break;
                case 'legacy':
                    this.currentTheme = 'legacy-theme';
                    break;
            }
        })
    }
}
