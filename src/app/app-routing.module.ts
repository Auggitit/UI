import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockitemComponent } from './master/inventory/stockitem/stockitem.component';
import { StockitemlistComponent } from './master/inventory/stockitemlist/stockitemlist.component';
import { StockitemcategoryComponent } from './master/inventory/stockitemcategory/stockitemcategory.component';
import { StockitemgroupComponent } from './master/inventory/stockitemgroup/stockitemgroup.component';
import { UomComponent } from './master/inventory/uom/uom.component';
import { StockitemupdateComponent } from './master/inventory/stockitemupdate/stockitemupdate.component';
import { LedgerComponent } from './master/account/ledger/ledger.component';
import { LedgerlistComponent } from './master/account/ledgerlist/ledgerlist.component';
import { LedgerupdateComponent } from './master/account/ledgerupdate/ledgerupdate.component';
import { VendorlistComponent } from './master/account/vendorlist/vendorlist.component';
import { VendorComponent } from './master/account/vendor/vendor.component';
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
import { GrnserviceComponent } from './vouchers/grnservicevch/grnservice/grnservice.component';
import { GrnservicelistComponent } from './vouchers/grnservicevch/grnservicelist/grnservicelist.component';
import { GrnserviceupdateComponent } from './vouchers/grnservicevch/grnserviceupdate/grnserviceupdate.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SovoucherComponent } from './vouchers/sovch/sovoucher/sovoucher.component';
import { SolistComponent } from './vouchers/sovch/solist/solist.component';
import { SoupdateComponent } from './vouchers/sovch/soupdate/soupdate.component';
import { SoserviceComponent } from './vouchers/soservicevch/soservice/soservice.component';
import { SoservicelistComponent } from './vouchers/soservicevch/soservicelist/soservicelist.component';
import { SoserviceupdateComponent } from './vouchers/soservicevch/soserviceupdate/soserviceupdate.component';
import { SalesComponent } from './vouchers/salesvch/sales/sales.component';
import { SaleslistComponent } from './vouchers/salesvch/saleslist/saleslist.component';
import { SalesupdateComponent } from './vouchers/salesvch/salesupdate/salesupdate.component';
import { ServicesaleComponent } from './vouchers/salesservicevch/servicesale/servicesale.component';
import { ServicesalelistComponent } from './vouchers/salesservicevch/servicesalelist/servicesalelist.component';
import { ServicesaleupdateComponent } from './vouchers/salesservicevch/servicesaleupdate/servicesaleupdate.component';
// import { PurchaseOrderReportsComponent } from './reports/purchase-order-reports/purchase-order-reports.component';
import { DebitNoteReportComponent } from './reports/debit-note-report/debit-note-report.component';
// import { SevicePurchaseOrderComponent } from './vouchersList/sevice-purchase-order/sevice-purchase-order.component';
// import { SevicePurchaseOrderReportComponent } from './reports/sevice-purchase-order-report/sevice-purchase-order-report.component';
// import { GrnListComponent } from './vouchersList/grn-list/grn-list.component';
// import { GrnReportComponent } from './reports/grn-report/grn-report.component';
// import { ServiceGrnListComponent } from './vouchersList/service-grn-list/service-grn-list.component';
// import { ServiceGrnReportComponent } from './reports/service-grn-report/service-grn-report.component';
import { SalesOrderListComponent } from './vouchersList/SalesOrder/sales-order-list/sales-order-list.component';
// import { PurchaseOrderListComponent } from './vouchersList/purchase-order-list/purchase-order-list.component';
import { CreditNoteComponent } from './vouchersList/credit-note/credit-note.component';
import { CreditNoteReportsComponent } from './reports/credit-note-reports/credit-note-reports.component';
import { DebitNoteComponent } from './vouchersList/debit-note/debit-note.component';
import { SalesOrderDetailsComponent } from './vouchersList/SalesOrder/sales-order-details/sales-order-details.component';
import { SalesOrderReportComponent } from './vouchersList/SalesOrder/sales-order-report/sales-order-report.component';
import { ServiceSalesOrderListComponent } from './vouchersList/ServiceSalesOrder/service-sales-order-list/service-sales-order-list.component';
import { ServiceSalesOrderReportComponent } from './vouchersList/ServiceSalesOrder/service-sales-order-report/service-sales-order-report.component';
import { ServiceSalesOrderDetailsComponent } from './vouchersList/ServiceSalesOrder/service-sales-order-details/service-sales-order-details.component';
import { SalesDetailsComponent } from './vouchersList/Sales/sales-details/sales-details.component';
import { ServiceSalesDetailsComponent } from './vouchersList/ServiceSales/service-sales-details/service-sales-details.component';
import { SalesListsComponent } from './vouchersList/Sales/sales-lists/sales-lists.component';
import { SalesReportComponent } from './vouchersList/Sales/sales-report/sales-report.component';
import { SalesServiceListComponent } from './vouchersList/ServiceSales/sales-service-list/sales-service-list.component';
import { SalesServiceReportComponent } from './vouchersList/ServiceSales/sales-service-report/sales-service-report.component';
import { PurchaseOrderListComponent } from './vouchersList/PurchaseOrder/purchase-order-list/purchase-order-list.component';
import { PurchaseOrderReportsComponent } from './vouchersList/PurchaseOrder/purchase-order-reports/purchase-order-reports.component';
import { PurchaseDetailsComponent } from './vouchersList/PurchaseOrder/purchase-details/purchase-details.component';
import { SevicePurchaseOrderComponent } from './vouchersList/ServicePurchaseOrder/sevice-purchase-order/sevice-purchase-order.component';
import { SevicePurchaseOrderReportComponent } from './vouchersList/ServicePurchaseOrder/sevice-purchase-order-report/sevice-purchase-order-report.component';
import { GrnListComponent } from './vouchersList/Grn/grn-list/grn-list.component';
import { GrnDetailsComponent } from './vouchersList/Grn/grn-details/grn-details.component';
import { GrnReportComponent } from './vouchersList/Grn/grn-report/grn-report.component';
import { ServiceGrnListComponent } from './vouchersList/ServiceGrn/service-grn-list/service-grn-list.component';
import { ServiceGrnDetailsComponent } from './vouchersList/ServiceGrn/service-grn-details/service-grn-details.component';
import { ServiceGrnReportComponent } from './vouchersList/ServiceGrn/service-grn-report/service-grn-report.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'stockitem', component: StockitemComponent },
  { path: 'stockitemlist', component: StockitemlistComponent },
  { path: 'stockitemupdate/:id', component: StockitemupdateComponent },
  { path: 'stockitemgroup', component: StockitemgroupComponent },
  { path: 'stockitemcategory', component: StockitemcategoryComponent },
  { path: 'uom', component: UomComponent },
  { path: 'ledger', component: LedgerComponent },
  { path: 'ledgerlist', component: LedgerlistComponent },
  { path: 'ledgerupdate/:id', component: LedgerupdateComponent },
  { path: 'vendor', component: VendorComponent },
  { path: 'vendorlist', component: VendorlistComponent },
  { path: 'vendorupdate/:id', component: VendorupdateComponent },
  { path: 'customer', component: CustomerComponent },
  { path: 'customerlist', component: CustomerlistComponent },
  { path: 'customerupdate/:id', component: CustomerupdateComponent },
  { path: 'country', component: CountryComponent },
  { path: 'state', component: StateComponent },
  { path: 'po', component: PoComponent },
  { path: 'polist', component: PolistComponent },
  { path: 'poupdate/:id', component: PoupdateComponent },
  { path: 'poservice', component: PoserviceComponent },
  { path: 'poservicelist', component: PoservicelistComponent },
  { path: 'poserviceupdate/:id', component: PoserviceupdateComponent },
  { path: 'grn', component: GrnComponent },
  { path: 'grnlist', component: GrnlistComponent },
  { path: 'grnupdate/:id', component: GrnupdateComponent },
  { path: 'servicegrn', component: GrnserviceComponent },
  { path: 'servicegrnlist', component: GrnservicelistComponent },
  { path: 'servicegrnupdate/:id', component: GrnserviceupdateComponent },
  { path: 'so', component: SovoucherComponent },
  { path: 'solist', component: SolistComponent },
  { path: 'soupdate/:id', component: SoupdateComponent },
  { path: 'soservice', component: SoserviceComponent },
  { path: 'soservicelist', component: SoservicelistComponent },
  { path: 'soserviceupdate/:id', component: SoserviceupdateComponent },
  { path: 'sales', component: SalesComponent },
  { path: 'saleslist', component: SaleslistComponent },
  { path: 'salesupdate/:id', component: SalesupdateComponent },
  { path: 'servicesales', component: ServicesaleComponent },
  { path: 'servicesaleslist', component: ServicesalelistComponent },
  { path: 'servicesalesupdate/:id', component: ServicesaleupdateComponent },
  { path: 'so-report', component: SalesOrderReportComponent },
  { path: 'sales-order-list', component: SalesOrderListComponent },
  { path: 'purchase-order-list', component: PurchaseOrderListComponent },
  { path: 'po-report', component: PurchaseOrderReportsComponent },
  {
    path: 'service-sales-order-list',
    component: ServiceSalesOrderListComponent,
  },
  {
    path: 'service-sales-order-reports',
    component: ServiceSalesOrderReportComponent,
  },
  { path: 'sales-list', component: SalesListsComponent },
  { path: 'sales-reports', component: SalesReportComponent },
  { path: 'sales-service-list', component: SalesServiceListComponent },
  { path: 'sales-service-report', component: SalesServiceReportComponent },
  { path: 'credit-note', component: CreditNoteComponent },
  { path: 'credit-note-report', component: CreditNoteReportsComponent },
  { path: 'debit-note', component: DebitNoteComponent },
  { path: 'debit-note-report', component: DebitNoteReportComponent },
  { path: 'service-po-list', component: SevicePurchaseOrderComponent },
  { path: 'service-po-report', component: SevicePurchaseOrderReportComponent },
  { path: 'grn-list', component: GrnListComponent },
  { path: 'grn-report', component: GrnReportComponent },
  { path: 'service-grn-list', component: ServiceGrnListComponent },
  { path: 'service-grn-report', component: ServiceGrnReportComponent },
  { path: 'sales-order-details', component: SalesOrderDetailsComponent },
  {
    path: 'service-sales-order-details',
    component: ServiceSalesOrderDetailsComponent,
  },
  { path: 'sales-details', component: SalesDetailsComponent },
  { path: 'service-sales-details', component: ServiceSalesDetailsComponent },
  { path: 'purchase-order-details', component: PurchaseDetailsComponent },
  { path: 'service-po-details', component: PurchaseDetailsComponent },
  { path: 'grn-details', component: GrnDetailsComponent },
  { path: 'service-grn-details', component: ServiceGrnDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
