import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'humanSize'
})
export class HumanSizePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (isNaN(value)) { return ''; }
    const size = parseFloat(value);
    const i = Math.floor( Math.log(size) / Math.log(1024) );
    const item: number =  size / Math.pow(1024, i);
    return item.toFixed(2) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
  }

}
