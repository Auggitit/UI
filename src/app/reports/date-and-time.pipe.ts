import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateAndTime',
})
export class DateAndTimePipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
