import {Pipe, PipeTransform} from '@angular/core';
import {faCircle} from '@fortawesome/free-solid-svg-icons';

@Pipe({
    name: 'jobState'
})
export class JobStatePipe implements PipeTransform {
    faCircle = faCircle;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform(value: any, args?: any): any {
        return `<fa-icon [icon]="faCircle" class="icon-job-successful">&nbsp;</fa-icon>`;
    }

}
