import {
  Component,
  Input,
  OnInit,
  ContentChild,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: 'app-mat-table',
  templateUrl: './mat-table.component.html',
  styleUrls: ['./mat-table.component.scss'],
})
export class MatTableComponent implements OnInit {
  @Input() paginationIndex: number = 0;
  @Input() filteredSalesOrderData: any[] = [];
  @Input() columns: any[] = [];
  @Input() pageCount: number = 10;
  totalRows!: number;
  numberOfPageButtonsVisible: number = 5;
  @ContentChild(TemplateRef) tableRowRef!: TemplateRef<any>;
  constructor() {}

  onClickPrev(): void {
    this.paginationIndex -= 1;
  }

  onClickIcon(colData: any): void {
    let salesData = this.filteredSalesOrderData.flatMap((item) => item);
    let updatedValue = salesData;
    this.columns.map((item: any) => {
      if (item.name === colData.name) {
        if (item.sortable === 1) {
          updatedValue = updatedValue.sort((a, b) => {
            if (a[item.name] < b[item.name]) {
              return 1;
            } else {
              return -1;
            }
          });
          item.sortable = 0;
        } else {
          updatedValue = updatedValue.sort((a, b) => {
            if (a[item.name] > b[item.name]) {
              return 1;
            } else {
              return -1;
            }
          });
          item.sortable = 1;
        }
      }
      return item;
    });
    let newArr: any[] = [];
    let rowIndex = 0;
    let rowCount = 0;
    for (let data of updatedValue) {
      if (rowCount === this.pageCount) {
        rowCount = 0;
        rowIndex++;
      }
      if (!newArr[rowIndex]) {
        newArr[rowIndex] = [];
      }
      newArr[rowIndex].push(data);
      rowCount++;
    }
    this.filteredSalesOrderData = newArr;
  }

  onClickNext(): void {
    this.paginationIndex += 1;
  }
  onClickPaginationNo(selectedPageNumber: number): void {
    this.paginationIndex = selectedPageNumber;
  }
  getPageNumber(index: number, paginationIndex: number) {
    if (paginationIndex >= this.numberOfPageButtonsVisible) {
      return paginationIndex - this.numberOfPageButtonsVisible + index + 2;
    } else return index + 1;
  }
  ngOnInit(): void {

  }

  ngOnChanges(): void {
    this.totalRows = this.filteredSalesOrderData.flatMap((item) => item).length;
    console.log("Tbale on change Activated")


  }
}
