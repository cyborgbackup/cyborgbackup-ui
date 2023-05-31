import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'longDate'
})
export class LongDatePipe implements PipeTransform {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public transform(value: any, args?: any): any {
    if ( value !== undefined && value !== '' ) {
      return moment(value).format('l LTS');
    } else {
      return '';
    }
  }

}
