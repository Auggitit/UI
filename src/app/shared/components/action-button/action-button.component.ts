import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss'],
})
export class ActionButtonComponent implements OnInit {
  @Input() isSave: boolean = true;
  @Input() loading: boolean = false;
  @Output() clickSave = new EventEmitter();
  @Output() clickUpdate = new EventEmitter();
  @Output() clickClearAll = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onClickSave(event: any): void {
    this.clickSave.emit(event);
  }

  onClickUpdate(event: any): void {
    this.clickUpdate.emit(event);
  }

  onClickClearAll(event: any): void {
    this.clickClearAll.emit(event);
  }
}
