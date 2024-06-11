import {Pipe, PipeTransform} from '@angular/core';
import {Md5} from 'ts-md5';

@Pipe({name: 'cbgMd5'})
export class Md5Pipe implements PipeTransform {

    transform(input: string): string {
        return String(Md5.hashAsciiStr(input));
    }
}
