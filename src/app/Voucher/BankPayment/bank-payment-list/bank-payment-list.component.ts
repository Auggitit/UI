import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bank-payment-list',
  templateUrl: './bank-payment-list.component.html',
  styleUrls: ['./bank-payment-list.component.scss']
})
export class BankPaymentListComponent implements OnInit {

  constructor(
    private router: Router,
  ) {

  }

  ngOnInit(): void {
  }

  onClickCreate() {
    this.router.navigateByUrl('bank-payment-create');
  }

}
