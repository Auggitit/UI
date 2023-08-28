import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-address-card',
  templateUrl: './address-card.component.html',
  styleUrls: ['./address-card.component.scss'],
})
export class AddressCardComponent implements OnInit {
  @Input() addressHeader!: string;
  @Input() addressTitle: string = 'VOUCH APPLICATION PRIVATE LIMITED';
  @Input() addressLine1: string = '96, MANGADU SWAMY STREET';
  @Input() addressLine2: string = ' CHENNAI, TAMIL NADU, INDIA';
  @Input() gstNumber: string = '44DDRET4343Q2Q3';
  @Input() contactNumber: string = '044-0449 9900';
  constructor() {}

  ngOnInit(): void {}
}
