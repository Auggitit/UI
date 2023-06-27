import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-content-cards',
  templateUrl: './content-cards.component.html',
  styleUrls: ['./content-cards.component.scss'],
})
export class ContentCardsComponent implements OnInit {
  @Input() contentToDisplay!: any;

  constructor() {}

  ngOnInit(): void {}
}
