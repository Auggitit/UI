import { Component, OnInit, Input, Output, EventEmitter,Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog-box',
  templateUrl: './confirmation-dialog-box.component.html',
  styleUrls: ['./confirmation-dialog-box.component.scss']
})
export class ConfirmationDialogBoxComponent implements OnInit {
  @Input() iconForDialog!:string;
  @Input() contentText!:string;


  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ) {}

  onClickNo(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }


}