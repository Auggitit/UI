import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';
import {
  dropDownData,
  exportOptions,
} from 'src/app/reports/stub/salesOrderStub';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock-item-create',
  templateUrl: './stock-item-create.component.html',
  styleUrls: ['./stock-item-create.component.scss'],
})
export class StockItemCreateComponent implements OnInit {
  @ViewChild('eitemname') eitemname: ElementRef | undefined;
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  itemcode: any;
  itemname: any;
  itemsku: any = '';
  itemhsn: any = '';
  itemundercode: any;
  itemcatcode: any;
  itemuomcode: any;
  itemuomname: any;
  taxabletype: any;
  gst: any = 0;
  cess: any = 0;
  vat: any = 0;
  rateofduty: any = 1;
  groupData: any;
  groupDropDownData: dropDownData[] = [];
  categoryData: dropDownData[] = [];
  uomData: dropDownData[] = [];
  gstapplicable: any = 'NO';
  typeofsupply: any = 'Goods';
  itemForm!: FormGroup;
  selectedID: any;
  uniqueID: any;
  saveAsOptions: dropDownData[] = exportOptions;
  loading: boolean = false;
  isCreateStockItem: boolean = true;
  oldid: any;
  gstreadonly: boolean = true;
  cessreadonly: boolean = true;
  taxableData: dropDownData[] = [
    { name: 'Taxable', id: 'Taxable' },
    { name: 'Nil Rated', id: 'Nil Rated' },
    { name: 'Exempt', id: 'Exempt' },
    { name: 'Not Applicable', id: 'Not Applicable' },
  ];

  supplyData: dropDownData[] = [
    { name: 'Goods', id: 'Goods' },
    { name: 'Services', id: 'Services' },
  ];

  constructor(
    public api: ApiService,
    public dialog: MatDialog,
    public fb: FormBuilder,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {}

  setValidations() {
    this.itemForm = this.fb.group({
      citemname: ['', [Validators.required]],
      citemsku: ['', [Validators.nullValidator]],
      citemhsn: ['', [Validators.nullValidator]],
      citemunder: ['', [Validators.required]],
      cItemUnderName: [''],
      citemcatcode: ['', [Validators.required]],
      citemuomcode: ['', [Validators.required]],
      ctaxabletype: ['', [Validators.required]],
      cgst: ['', [Validators.nullValidator]],
      ccess: ['', [Validators.nullValidator]],
      ctypeofsupply: ['', [Validators.nullValidator]],
    });
  }

  ngAfterViewInit() {
    this.eitemname?.nativeElement.focus();
  }

  ngOnInit(): void {
    this.setValidations();
    this.loadgroup();
    this.loadcategory();
    this.loaduom();
    this.oldid = this.activatedRoute.snapshot.paramMap.get('id');

    this.itemForm.get('citemunder')?.valueChanges.subscribe((value) => {
      let stateCode = this.groupDropDownData.filter(
        (item) => item.id === value
      );
      this.itemForm.get('cItemUnderName')?.setValue(stateCode[0].name);
    });

    if (this.activatedRoute.snapshot.queryParams['type'] == 'edit') {
      this.isCreateStockItem = false;

      this.api.get_ItemDataWithID(this.oldid).subscribe((res) => {
        console.log(res, 'previous');

        this.itemForm.patchValue({
          citemname: res.itemname,
          citemunder: res.itemunder,
          citemsku: res.itemsku,
          citemhsn: res.itemhsn,
          citemcatcode: res.itemcategory,
          citemuomcode: res.uom,
          ctaxabletype: res.taxable,
          ctypeofsupply: res.typeofSupply,
          cgst: res.gst,
          ccess: res.cess,
        });
        this.itemcode = res.itemcode;
        console.log(this.itemcode, 'reeeeeeeeeeeeeeeee code');
      });
    }
  }

  onClickButton(): void {
    this.router.navigateByUrl('stock-item-list');
  }

  onClickAddButton(): void {
    this.router.navigateByUrl('stock-item-create');
  }

  loadgroup() {
    this.api.get_GroupData().subscribe((res) => {
      let gData = res.length
        ? res.map((item: any) => {
            return {
              name: item.groupname,
              id: item.groupcode,
            };
          })
        : [];
      this.groupDropDownData = gData;
    });
  }

  loadcategory() {
    this.api.get_CategoryData().subscribe((res) => {
      this.categoryData = res.length
        ? res.map((item: any) => {
            return { name: item.catname, id: item.catcode };
          })
        : [];
    });
  }
  loaduom() {
    this.api.get_UOMData().subscribe((res) => {
      this.uomData = res.length
        ? res.map((item: any) => {
            return { name: item.uomname, id: item.uomcode };
          })
        : [];
    });
  }

  async getMaxCode() {
    return new Promise((resolve) => {
      this.api.get_CategoryMaxID().subscribe((res) => {
        this.itemcode = res;
        resolve({ action: 'success' });
      });
    });
  }

  validate() {
    var val;
    if (this.taxabletype == 'Taxable') {
      if (this.gst == '' || this.gst == undefined || this.gst == Number.isNaN) {
        Swal.fire({
          icon: 'info',
          title: 'GST Error',
          text: 'Please Check GST Details',
        });
        return false;
      } else {
        val = true;
      }
      if (
        this.cess == '' ||
        this.cess == undefined ||
        this.cess == Number.isNaN
      ) {
        Swal.fire({
          icon: 'info',
          title: 'CESS Error',
          text: 'Please Check CESS Details',
        });
        return false;
      } else {
        val = true;
      }
    } else {
      val = true;
    }
    return val;
  }

  clear() {
    this.itemname = '';
    this.itemsku = '';
    this.itemhsn = '';
    this.gst = '';
    this.cess = '';
    this.loading = false;
    this.setValidations();
    this.itemForm.reset();
    this.formDirective.resetForm();
  }

  //Dropdown
  changeGroup(event: any) {
    this.itemundercode = event.value;
  }
  changeCategory(event: any) {
    this.itemcatcode = event.value;
  }

  changeTOS(event: any) {
    this.typeofsupply = event.source.triggerValue;
  }

  changeTaxability(event: any) {
    this.taxabletype = event.source.triggerValue;
    if (this.taxabletype == 'Taxable') {
      this.gstreadonly = false;
      this.cessreadonly = false;
      this.gst = '0';
      this.cess = '0';
    }
    if (this.taxabletype == 'Nil Rated') {
      this.gstreadonly = true;
      this.cessreadonly = true;
      this.gst = '0';
      this.cess = '0';
    }
    if (this.taxabletype == 'Exempt') {
      this.gstreadonly = true;
      this.cessreadonly = true;
      this.gst = '0';
      this.cess = '0';
    }
    if (this.taxabletype == 'Not Applicable') {
      this.gstreadonly = true;
      this.cessreadonly = true;
      this.gst = '0';
      this.cess = '0';
    }
  }

  changeUOM(event: any) {
    this.itemuomcode = event.value;
    this.itemuomname = event.source.triggerValue;
  }

  toggleGST() {
    if (this.gstapplicable == 'YES') {
      this.gstapplicable = 'NO';
    } else {
      this.gstapplicable = 'YES';
    }
  }

  //Enter Key Events
  itemNameEnter(event: any) {
    if (typeof this.itemname != 'undefined' && this.itemname) {
      {
        //this.eunder?.focus();
      }
    }
  }

  gotoList() {
    this.router.navigateByUrl('/stockitemlist');
  }

  submit() {
    var res = this.validate();
    if (res == true) {
      if (this.itemForm.valid) {
        this.loading = true;
        setTimeout(() => {
          this.getMaxCode().then((res) => {
            if (this.isCreateStockItem) {
              this.save();
            } else if (!this.isCreateStockItem) {
              this.update();
            }
          });
        }, 400);
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Fill Mandatory Fields',
          text: 'Plese fill all mandatory fields',
        });
      }
    }
  }

  save() {
    this.uniqueID = Guid.create();
    var postData = {
      id: this.uniqueID.value,
      itemcode: this.itemcode,
      itemname: this.itemForm.value.citemname,
      itemunder: this.itemForm.value.citemunder,
      itemcategory: this.itemForm.value.citemcatcode,
      uom: this.itemForm.value.citemuomcode,
      gstApplicable: 'NO',
      gstCalculationtype: 'N/A',
      taxable: this.itemForm.value.ctaxabletype,
      gst: this.itemForm.value.cgst,
      cess: this.itemForm.value.ccess,
      vat: this.vat,
      typeofSupply: this.itemForm.value.ctypeofsupply,
      rateofDuty: this.rateofduty,
      rCreatedDateTime: new Date(),
      rStatus: 'A',
      itemsku: this.itemForm.value.citemsku,
      itemhsn: this.itemForm.value.citemhsn,
    };
    this.api.Insert_ItemData(postData).subscribe({
      next: (data) => {
        let dialogRef = this.dialog.open(SuccessmsgComponent, {
          data: 'Stock Item Successfully Saved!',
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.clear();
          this.loading = false;
        });
      },
      error: (err) => {
        alert('Some Error Occured');
        this.loading = false;
      },
    });
  }

  update() {
    var postdata = {
      id: this.oldid,
      itemcode: this.itemcode,
      itemname: this.itemForm.value.citemname,
      itemunder: this.itemForm.value.citemunder,
      itemcategory: this.itemForm.value.citemcatcode,
      uom: this.itemForm.value.citemuomcode,
      gstApplicable: '',
      gstCalculationtype: 'N/A',
      taxable: this.itemForm.value.ctaxabletype,
      gst: this.itemForm.value.cgst,
      cess: this.itemForm.value.ccess,
      vat: this.vat,
      typeofSupply: this.itemForm.value.ctypeofsupply,
      rateofDuty: this.rateofduty,
      rCreatedDateTime: new Date(),
      rStatus: 'A',
      itemsku: this.itemForm.value.citemsku,
      itemhsn: this.itemForm.value.citemhsn,
    };

    this.api.Update_ItemData(this.oldid, postdata).subscribe({
      next: (data) => {
        this.loading = false;
        let dialogRef = this.dialog.open(SuccessmsgComponent, {
          data: 'Stock Item Successfully Updated',
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.clear();
          this.loading = false;
          this.router.navigateByUrl('stock-item-list');
        });
      },
      error: (err) => {
        alert('Some Error Occured');
        this.loading = false;
      },
    });
  }
}
