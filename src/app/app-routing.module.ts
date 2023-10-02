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
import { SalesOrderListComponent } from './vouchersList/SalesOrder/sales-order-list/sales-order-list.component';
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
import { CreditNoteComponent } from './vouchersList/CreditNote/credit-note/credit-note.component';
import { CreditNoteDetailsComponent } from './vouchersList/CreditNote/credit-note-details/credit-note-details.component';
import { CreditNoteReportsComponent } from './vouchersList/CreditNote/credit-note-reports/credit-note-reports.component';
import { DebitNoteComponent } from './vouchersList/DebitNote/debit-note/debit-note.component';
import { DebitNoteReportComponent } from './vouchersList/DebitNote/debit-note-report/debit-note-report.component';
import { DebitNoteDetailsComponent } from './vouchersList/DebitNote/debit-note-details/debit-note-details.component';
import { ServicePoDetailsComponent } from './vouchersList/ServicePurchaseOrder/service-po-details/service-po-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PoComponent } from './vouchers/PurchaseProcess/povch/po/po.component';
import { PoupdateComponent } from './vouchers/PurchaseProcess/povch/poupdate/poupdate.component';
import { PolistComponent } from './vouchers/PurchaseProcess/povch/polist/polist.component';
import { PoserviceComponent } from './vouchers/PurchaseProcess/poservicevch/poservice/poservice.component';
import { PoservicelistComponent } from './vouchers/PurchaseProcess/poservicevch/poservicelist/poservicelist.component';
import { PoserviceupdateComponent } from './vouchers/PurchaseProcess/poservicevch/poserviceupdate/poserviceupdate.component';
import { GrnComponent } from './vouchers/PurchaseProcess/grnvch/grn/grn.component';
import { GrnlistComponent } from './vouchers/PurchaseProcess/grnvch/grnlist/grnlist.component';
import { GrnupdateComponent } from './vouchers/PurchaseProcess/grnvch/grnupdate/grnupdate.component';
import { GrnserviceComponent } from './vouchers/PurchaseProcess/grnservicevch/grnservice/grnservice.component';
import { GrnservicelistComponent } from './vouchers/PurchaseProcess/grnservicevch/grnservicelist/grnservicelist.component';
import { GrnserviceupdateComponent } from './vouchers/PurchaseProcess/grnservicevch/grnserviceupdate/grnserviceupdate.component';
import { SovoucherComponent } from './vouchers/SalesandDistrubution/sovch/sovoucher/sovoucher.component';
import { SolistComponent } from './vouchers/SalesandDistrubution/sovch/solist/solist.component';
import { SoupdateComponent } from './vouchers/SalesandDistrubution/sovch/soupdate/soupdate.component';
import { SoserviceComponent } from './vouchers/SalesandDistrubution/soservicevch/soservice/soservice.component';
import { SoservicelistComponent } from './vouchers/SalesandDistrubution/soservicevch/soservicelist/soservicelist.component';
import { SoserviceupdateComponent } from './vouchers/SalesandDistrubution/soservicevch/soserviceupdate/soserviceupdate.component';
import { SalesComponent } from './vouchers/SalesandDistrubution/salesvch/sales/sales.component';
import { SaleslistComponent } from './vouchers/SalesandDistrubution/salesvch/saleslist/saleslist.component';
import { SalesupdateComponent } from './vouchers/SalesandDistrubution/salesvch/salesupdate/salesupdate.component';
import { ServicesaleComponent } from './vouchers/SalesandDistrubution/salesservicevch/servicesale/servicesale.component';
import { ServicesaleupdateComponent } from './vouchers/SalesandDistrubution/salesservicevch/servicesaleupdate/servicesaleupdate.component';
import { ServicesalelistComponent } from './vouchers/SalesandDistrubution/salesservicevch/servicesalelist/servicesalelist.component';
import { LedgerListComponent } from './Masters/accountMaster/ledgers/ledger-list/ledger-list.component';
import { NewLedgerComponent } from './Masters/accountMaster/ledgers/new-ledger/new-ledger.component';
import { VendorListComponent } from './Masters/accountMaster/Vendor/vendor-list/vendor-list.component';
import { NewVendorComponent } from './Masters/accountMaster/Vendor/new-vendor/new-vendor.component';
import { CustomerCreateComponent } from './Masters/accountMaster/Customer/customer-create/customer-create.component';
import { CustomerListComponent } from './Masters/accountMaster/Customer/customer-list/customer-list.component';
import { StockItemListComponent } from './Masters/inventoryMaster/stockItem/stock-item-list/stock-item-list.component';
import { StockGroupItemsComponent } from './Masters/inventoryMaster/stockGroup/stock-group-items/stock-group-items.component';
import { StockCategoryListComponent } from './Masters/inventoryMaster/stockCategory/stock-category-list/stock-category-list.component';
import { UomListComponent } from './Masters/inventoryMaster/uom/uom-list/uom-list.component';
import { StateMasterListComponent } from './Masters/otherMaster/state-master-list/state-master-list.component';
import { CountryMasterListComponent } from './Masters/otherMaster/country-master-list/country-master-list.component';
import { StockItemCreateComponent } from './Masters/inventoryMaster/stockItem/stock-item-create/stock-item-create.component';
import { StockGroupCreateComponent } from './Masters/inventoryMaster/stockGroup/stock-group-create/stock-group-create.component';
import { StockCategoryCreateComponent } from './Masters/inventoryMaster/stockCategory/stock-category-create/stock-category-create.component';
import { UomCreateComponent } from './Masters/inventoryMaster/uom/uom-create/uom-create.component';
import { CountryMasterCreateComponent } from './Masters/otherMaster/country-master-create/country-master-create.component';
import { StateMasterCreateComponent } from './Masters/otherMaster/state-master-create/state-master-create.component';
import { HsnListComponent } from './Masters/inventoryMaster/hsn/hsn-list/hsn-list.component';
import { HsnCreateComponent } from './Masters/inventoryMaster/hsn/hsn-create/hsn-create.component';

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
  { path: 'poupdate', component: PoupdateComponent },
  { path: 'poservice', component: PoserviceComponent },
  { path: 'poservicelist', component: PoservicelistComponent },
  { path: 'poserviceupdate', component: PoserviceupdateComponent },
  { path: 'grn', component: GrnComponent },
  { path: 'grnlist', component: GrnlistComponent },
  { path: 'grnupdate/:id', component: GrnupdateComponent },
  { path: 'servicegrn', component: GrnserviceComponent },
  { path: 'servicegrnlist', component: GrnservicelistComponent },
  { path: 'servicegrnupdate', component: GrnserviceupdateComponent },
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
  { path: 'service-po-details', component: ServicePoDetailsComponent },
  { path: 'grn-details', component: GrnDetailsComponent },
  { path: 'service-grn-details', component: ServiceGrnDetailsComponent },
  { path: 'credit-note-details', component: CreditNoteDetailsComponent },
  { path: 'debit-note-details', component: DebitNoteDetailsComponent },
  { path: 'ledger-list', component: LedgerListComponent },
  { path: 'create-ledger', component: NewLedgerComponent },
  { path: 'create-ledger/:id', component: NewLedgerComponent },
  { path: 'vendor-list', component: VendorListComponent },
  { path: 'create-vendor', component: NewVendorComponent },
  { path: 'create-vendor/:id', component: NewVendorComponent },
  { path: 'customer-list', component: CustomerListComponent },
  { path: 'customer-create', component: CustomerCreateComponent },
  { path: 'customer-create/:id', component: CustomerCreateComponent },
  { path: 'create-customer', component: CustomerCreateComponent },
  { path: 'stock-item-list', component: StockItemListComponent },
  { path: 'stock-item-create', component: StockItemCreateComponent },
  { path: 'stock-item-create/:id', component: StockItemCreateComponent },
  { path: 'stock-group-list', component: StockGroupItemsComponent },
  { path: 'stock-group-create', component: StockGroupCreateComponent },
  { path: 'stock-group-create/:id', component: StockGroupCreateComponent },
  { path: 'stock-category-list', component: StockCategoryListComponent },
  { path: 'stock-category-create', component: StockCategoryCreateComponent },
  {
    path: 'stock-category-create/:id',
    component: StockCategoryCreateComponent,
  },
  { path: 'uom-list', component: UomListComponent },
  { path: 'uom-create', component: UomCreateComponent },
  { path: 'uom-create/:id', component: UomCreateComponent },
  { path: 'country-master-list', component: CountryMasterListComponent },
  { path: 'country-master-create', component: CountryMasterCreateComponent },
  {
    path: 'country-master-create/:id',
    component: CountryMasterCreateComponent,
  },
  { path: 'state-master-list', component: StateMasterListComponent },
  { path: 'state-master-create', component: StateMasterCreateComponent },
  { path: 'state-master-create/:id', component: StateMasterCreateComponent },

  { path: 'hsn-list', component: HsnListComponent},
  { path: 'hsn-create', component: HsnCreateComponent},
  { path: 'hsn-create/:id', component: HsnCreateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
