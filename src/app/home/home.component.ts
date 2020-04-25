import { Component, OnInit } from '@angular/core';
import {NbSpinnerService} from '@nebular/theme';
import {Router} from '@angular/router';

@Component({
  selector: 'cbg-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private spinner$: NbSpinnerService,
              private router: Router) { }

  ngOnInit() {
    this.spinner$.load();
  }

  goToLogin(): void {
    this.router.navigate(['auth/login']);
  }

}
