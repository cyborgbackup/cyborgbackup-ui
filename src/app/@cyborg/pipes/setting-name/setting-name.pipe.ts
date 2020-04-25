import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'settingName'
})
export class SettingNamePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const names = value.replace('cyborgbackup_', '').split('_');
    for (let i = 0; i < names.length; i++) {
      names[i] = names[i].replace(/^\w/, c => c.toUpperCase());
    }
    return names.join(' ');
  }

}
