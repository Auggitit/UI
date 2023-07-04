import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormControlName, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-table-column-display-filter',
  templateUrl: './table-column-display-filter.component.html',
  styleUrls: ['./table-column-display-filter.component.scss']
})
export class TableColumnDisplayFilterComponent implements OnInit {
  @Output() onClickFilterTableColumns = new EventEmitter;
 @Input() columnFilterName!: FormControlName | any;
  @Input() listOfTableColumns!:any;
 @Input() ColumnFilterFormGroup!: any;
  constructor() { }

  ngOnInit(): void {
    //console.log("listOfTableColumns",this. listOfTableColumns);
    //console.log("---------",this.listOfTableColumns[0].title)
  }
  onClickButton(selectedColumnsHeader:any){
    //this.onClickFilterTableColumns.emit(selectedColumnsHeader);
  }
  onSelectionChange(selectedColumnIndex: number){

    this.listOfTableColumns[selectedColumnIndex].needToShow=!this.listOfTableColumns[selectedColumnIndex].needToShow
    //this.columnFilterName.set()
  }
  ngOnChanges(): void {
   
    console.log("Coulun filer")
  }

}
