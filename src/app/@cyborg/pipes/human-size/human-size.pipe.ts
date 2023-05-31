import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'humanSize'
})
export class HumanSizePipe implements PipeTransform {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, args?: any): any {
    if (isNaN(value)) {
     return '';
    }
    const size = parseFloat(value);
    if (size <= 0) {
      return '0 B';
    }
    const i = Math.floor( Math.log(size) / Math.log(1024) );
    const item: number =  size / Math.pow(1024, i);
    return item.toFixed(2) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
  }

}
