import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

export interface Dateobj {
  startrange: any;
  endrange: any;
}
@Injectable()
export class AppDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return super.format(date, displayFormat);
  }
}

export const APP_DATE_FORMATS = {
  parse: {
    dateInput: { day: 'numeric', month: 'numeric', year: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};
export class CusDate {
  daterange: Dateobj[] = [];
  logDateRange(startrange: any, endrange: any) {
    this.daterange = [];
    var arr = [startrange, endrange];

    if (startrange && endrange) {
      for (var i = 0; i < arr.length; i++) {
        const fromDateObj = new Date(arr[i]);
        const timeZoneOffsetMs = fromDateObj.getTimezoneOffset() * 60 * 1000; // Get time zone offset in milliseconds
        const fromDateAdjusted = new Date(
          fromDateObj.getTime() - timeZoneOffsetMs
        ); // Adjust date based on time zone offset
        const fromFormatted = fromDateAdjusted
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, '');
        arr[i] = fromFormatted;
      }
      this.daterange.push({ startrange: arr[0], endrange: arr[1] });
      return this.daterange;
    } else {
      return console.log('error');
    }
  }
   dateformat(fdate:any)  //'2023-07-11T00:00:00'
     {
    const dateString = fdate;
    const date = new Date(dateString);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    return formattedDate;
  }
}
