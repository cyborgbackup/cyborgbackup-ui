import {Component, OnInit, ViewChild} from '@angular/core';
import {NbLoginComponent} from '@nebular/auth';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'cbg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends  NbLoginComponent implements OnInit {
  options: string[];
  specificServer = false;
  filteredOptions$: Observable<string[]>;
  @ViewChild('cyborgServerInput') cyborgServerInput;

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
  }

  getFilteredOptions(value: string): Observable<string[]> {
    return of(value).pipe(
        map(filterString => this.filter(filterString)),
    );
  }

  onChange() {
    this.filteredOptions$ = this.getFilteredOptions(this.cyborgServerInput.nativeElement.value);
  }

  onSelectionChange($event) {
    this.filteredOptions$ = this.getFilteredOptions($event);
  }

  ngOnInit(): void {
    const savedServers = JSON.parse(localStorage.getItem('cyborgServers'));
    this.options = [];
    if (savedServers !== null && typeof savedServers === 'object' ) {
      this.options = savedServers;
    }
  }

  checkServer(event): void {
    if (!event) {
      this.user.server = '';
    }
  }
}
