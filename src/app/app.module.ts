import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';

import { HeaderComponent } from './applayout/header/header.component';
import { SidebarComponent } from './applayout/sidebar/sidebar.component';
import { StockitemComponent } from './master/inventory/stockitem/stockitem.component';
import { StockitemgroupComponent } from './master/inventory/stockitemgroup/stockitemgroup.component';
import { SuccessmsgComponent } from './dialogs/successmsg/successmsg.component';
import { StockitemlistComponent } from './master/inventory/stockitemlist/stockitemlist.component';
import { StockitemcategoryComponent } from './master/inventory/stockitemcategory/stockitemcategory.component';
import { UomComponent } from './master/inventory/uom/uom.component';
import { ConfirmmsgComponent } from './dialogs/confirmmsg/confirmmsg.component';
import { StockitemupdateComponent } from './master/inventory/stockitemupdate/stockitemupdate.component';
import { LedgerComponent } from './master/account/ledger/ledger.component';
import { LedgerlistComponent } from './master/account/ledgerlist/ledgerlist.component';
import { LedgerupdateComponent } from './master/account/ledgerupdate/ledgerupdate.component';
import { VendorComponent } from './master/account/vendor/vendor.component';
import { VendorlistComponent } from './master/account/vendorlist/vendorlist.component';
import { VendorupdateComponent } from './master/account/vendorupdate/vendorupdate.component';
import { CustomerComponent } from './master/account/customer/customer.component';
import { CustomerlistComponent } from './master/account/customerlist/customerlist.component';
import { CustomerupdateComponent } from './master/account/customerupdate/customerupdate.component';
import { CountryComponent } from './master/other/country/country.component';
import { StateComponent } from './master/other/state/state.component';
import { PoComponent } from './vouchers/povch/po/po.component';
import { PolistComponent } from './vouchers/povch/polist/polist.component';
import { PoupdateComponent } from './vouchers/povch/poupdate/poupdate.component';
import { PoserviceComponent } from './vouchers/poservicevch/poservice/poservice.component';
import { PoservicelistComponent } from './vouchers/poservicevch/poservicelist/poservicelist.component';
import { PoserviceupdateComponent } from './vouchers/poservicevch/poserviceupdate/poserviceupdate.component';
import { GrnComponent } from './vouchers/grnvch/grn/grn.component';
import { GrnlistComponent } from './vouchers/grnvch/grnlist/grnlist.component';
import { GrnupdateComponent } from './vouchers/grnvch/grnupdate/grnupdate.component';
import { PurchasevtypeComponent } from './vchtype/purchasevtype/purchasevtype.component';
import { PendingpoComponent } from './vouchers/models/pendingpo/pendingpo.component';
import { PendingsoComponent } from './vouchers/models/pendingso/pendingso.component';
import { GrnserviceComponent } from './vouchers/grnservicevch/grnservice/grnservice.component';
import { GrnservicelistComponent } from './vouchers/grnservicevch/grnservicelist/grnservicelist.component';
import { GrnserviceupdateComponent } from './vouchers/grnservicevch/grnserviceupdate/grnserviceupdate.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SolistComponent } from './vouchers/sovch/solist/solist.component';
import { SovoucherComponent } from './vouchers/sovch/sovoucher/sovoucher.component';
import { SoupdateComponent } from './vouchers/sovch/soupdate/soupdate.component';
import { AdddelivaddressComponent } from './vouchers/models/adddelivaddress/adddelivaddress.component';
import { ShowdelivaddressComponent } from './vouchers/models/showdelivaddress/showdelivaddress.component';
import { SoserviceComponent } from './vouchers/soservicevch/soservice/soservice.component';
import { SoservicelistComponent } from './vouchers/soservicevch/soservicelist/soservicelist.component';
import { SoserviceupdateComponent } from './vouchers/soservicevch/soserviceupdate/soserviceupdate.component';
import { SalesComponent } from './vouchers/salesvch/sales/sales.component';
import { SaleslistComponent } from './vouchers/salesvch/saleslist/saleslist.component';
import { SalesupdateComponent } from './vouchers/salesvch/salesupdate/salesupdate.component';
import { SalesvtypeComponent } from './vchtype/salesvtype/salesvtype.component';
import { ServicesaleComponent } from './vouchers/salesservicevch/servicesale/servicesale.component';
import { ServicesalelistComponent } from './vouchers/salesservicevch/servicesalelist/servicesalelist.component';
import { ServicesaleupdateComponent } from './vouchers/salesservicevch/servicesaleupdate/servicesaleupdate.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from './shared/shared.module';
// import { PurchaseOrderReportsComponent } from './reports/purchase-order-reports/purchase-order-reports.component';
// import { DebitNoteReportComponent } from './reports/debit-note-report/debit-note-report.component';
// import { SevicePurchaseOrderComponent } from './vouchersList/sevice-purchase-order/sevice-purchase-order.component';
// import { SevicePurchaseOrderReportComponent } from './reports/sevice-purchase-order-report/sevice-purchase-order-report.component';
// import { GrnListComponent } from './vouchersList/grn-list/grn-list.component';
// import { GrnReportComponent } from './reports/grn-report/grn-report.component';
// import { ServiceGrnListComponent } from './vouchersList/service-grn-list/service-grn-list.component';
// import { ServiceGrnReportComponent } from './reports/service-grn-report/service-grn-report.component';
// import { DebitNoteComponent } from './vouchersList/debit-note/debit-note.component';
// import { CreditNoteComponent } from './vouchersList/credit-note/credit-note.component';
// import { CreditNoteReportsComponent } from './reports/credit-note-reports/credit-note-reports.component';
import { SalesOrderDetailsComponent } from './vouchersList/SalesOrder/sales-order-details/sales-order-details.component';
import { SalesOrderListComponent } from './vouchersList/SalesOrder/sales-order-list/sales-order-list.component';
import { TargetAndAchievementComponent } from './shared/components/target-and-achievement/target-and-achievement.component';
import { GetProductDetailsPipe } from './reports/get-product-details.pipe';
import { SalesOrderReportComponent } from './vouchersList/SalesOrder/sales-order-report/sales-order-report.component';
import { ServiceSalesOrderDetailsComponent } from './vouchersList/ServiceSalesOrder/service-sales-order-details/service-sales-order-details.component';
import { ServiceSalesOrderListComponent } from './vouchersList/ServiceSalesOrder/service-sales-order-list/service-sales-order-list.component';
import { ServiceSalesOrderReportComponent } from './vouchersList/ServiceSalesOrder/service-sales-order-report/service-sales-order-report.component';
import { SalesDetailsComponent } from './vouchersList/Sales/sales-details/sales-details.component';
import { ServiceSalesDetailsComponent } from './vouchersList/ServiceSales/service-sales-details/service-sales-details.component';
import { SalesListsComponent } from './vouchersList/Sales/sales-lists/sales-lists.component';
import { SalesReportComponent } from './vouchersList/Sales/sales-report/sales-report.component';
import { SalesServiceListComponent } from './vouchersList/ServiceSales/sales-service-list/sales-service-list.component';
import { SalesServiceReportComponent } from './vouchersList/ServiceSales/sales-service-report/sales-service-report.component';
import { PurchaseOrderListComponent } from './vouchersList/PurchaseOrder/purchase-order-list/purchase-order-list.component';
import { PurchaseOrderReportsComponent } from './vouchersList/PurchaseOrder/purchase-order-reports/purchase-order-reports.component';
import { PurchaseDetailsComponent } from './vouchersList/PurchaseOrder/purchase-details/purchase-details.component';
import { ServicePoDetailsComponent } from './vouchersList/ServicePurchaseOrder/service-po-details/service-po-details.component';
import { SevicePurchaseOrderComponent } from './vouchersList/ServicePurchaseOrder/sevice-purchase-order/sevice-purchase-order.component';
import { SevicePurchaseOrderReportComponent } from './vouchersList/ServicePurchaseOrder/sevice-purchase-order-report/sevice-purchase-order-report.component';
import { GrnDetailsComponent } from './vouchersList/Grn/grn-details/grn-details.component';
import { GrnListComponent } from './vouchersList/Grn/grn-list/grn-list.component';
import { GrnReportComponent } from './vouchersList/Grn/grn-report/grn-report.component';
import { ServiceGrnDetailsComponent } from './vouchersList/ServiceGrn/service-grn-details/service-grn-details.component';
import { ServiceGrnListComponent } from './vouchersList/ServiceGrn/service-grn-list/service-grn-list.component';
import { ServiceGrnReportComponent } from './vouchersList/ServiceGrn/service-grn-report/service-grn-report.component';
import { CreditNoteDetailsComponent } from './vouchersList/CreditNote/credit-note-details/credit-note-details.component';
import { CreditNoteComponent } from './vouchersList/CreditNote/credit-note/credit-note.component';
import { CreditNoteReportsComponent } from './vouchersList/CreditNote/credit-note-reports/credit-note-reports.component';
import { DebitNoteComponent } from './vouchersList/DebitNote/debit-note/debit-note.component';
import { DebitNoteDetailsComponent } from './vouchersList/DebitNote/debit-note-details/debit-note-details.component';
import { DebitNoteReportComponent } from './vouchersList/DebitNote/debit-note-report/debit-note-report.component';
import { DateAndTimePipe } from './reports/date-and-time.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    StockitemComponent,
    StockitemgroupComponent,
    SuccessmsgComponent,
    StockitemlistComponent,
    StockitemcategoryComponent,
    UomComponent,
    ConfirmmsgComponent,
    StockitemupdateComponent,
    LedgerComponent,
    LedgerlistComponent,
    LedgerupdateComponent,
    VendorComponent,
    VendorlistComponent,
    VendorupdateComponent,
    CustomerComponent,
    CustomerlistComponent,
    CustomerupdateComponent,
    CountryComponent,
    StateComponent,
    PoComponent,
    PolistComponent,
    PoupdateComponent,
    PoserviceComponent,
    PoservicelistComponent,
    PoserviceupdateComponent,
    GrnComponent,
    GrnlistComponent,
    GrnupdateComponent,
    PurchasevtypeComponent,
    PendingpoComponent,
    PendingsoComponent,
    GrnserviceComponent,
    GrnservicelistComponent,
    GrnserviceupdateComponent,
    DashboardComponent,
    SolistComponent,
    SovoucherComponent,
    SoupdateComponent,
    AdddelivaddressComponent,
    ShowdelivaddressComponent,
    SoserviceComponent,
    SoservicelistComponent,
    SoserviceupdateComponent,
    SalesComponent,
    SaleslistComponent,
    SalesupdateComponent,
    SalesvtypeComponent,
    ServicesaleComponent,
    ServicesalelistComponent,
    ServicesaleupdateComponent,
    SalesOrderReportComponent,
    GetProductDetailsPipe,
    TargetAndAchievementComponent,
    SalesOrderListComponent,
    PurchaseOrderListComponent,
    PurchaseOrderReportsComponent,
    ServiceSalesOrderListComponent,
    ServiceSalesOrderReportComponent,
    SalesListsComponent,
    SalesReportComponent,
    SalesServiceListComponent,
    SalesServiceReportComponent,
    CreditNoteComponent,
    CreditNoteReportsComponent,
    DebitNoteComponent,
    DebitNoteReportComponent,
    SevicePurchaseOrderComponent,
    SevicePurchaseOrderReportComponent,
    GrnListComponent,
    GrnReportComponent,
    ServiceGrnListComponent,
    ServiceGrnReportComponent,
    SalesOrderDetailsComponent,
    ServiceSalesOrderDetailsComponent,
    SalesDetailsComponent,
    ServiceSalesDetailsComponent,
    PurchaseDetailsComponent,
    ServicePoDetailsComponent,
    GrnDetailsComponent,
    ServiceGrnDetailsComponent,
    CreditNoteDetailsComponent,
    DebitNoteDetailsComponent,
    DateAndTimePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatTabsModule,
    MatRadioModule,
    MatTableModule,
    MatIconModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatToolbarModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatPaginatorModule,
    NgApexchartsModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
