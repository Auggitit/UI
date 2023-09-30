import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ConfirmmsgComponent } from 'src/app/dialogs/confirmmsg/confirmmsg.component';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';
import {
  dropDownData,
  exportOptions,
} from 'src/app/reports/stub/salesOrderStub';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock-category-create',
  templateUrl: './stock-category-create.component.html',
  styleUrls: ['./stock-category-create.component.scss'],
})
export class StockCategoryCreateComponent implements OnInit {
  //Set Element Ref
  @ViewChild('ename') ename: ElementRef | undefined;
  @ViewChild('eunder') eunder: MatSelect | undefined;
  @ViewChild('esave') esave: ElementRef | undefined;

  loading: boolean = false;
  //Variable Declaration
  categoryForm!: FormGroup;
  uniqueID: any;
  catcode: any;
  catname: any;
  catundername: any;
  saveAsOptions: dropDownData[] = exportOptions;
  catundercode: any;
  selectedID: any;
  displayedColumns: string[] = ['CATEGORY_NAME', 'ACTIONS'];
  dataSource!: MatTableDataSource<any>;
  savedData: any;
  categetoryDropDownData: dropDownData[] = [];
  isCreateCategory: boolean = true;
  oldid: any;

  constructor(
    public api: ApiService,
    public dialog: MatDialog,
    public fb: FormBuilder,
    public router: Router,
    public activatedRoute: ActivatedRoute,
  ) { }
  //Validators
  setValidations() {
    this.categoryForm = this.fb.group({
      ccatname: ['', Validators.required],
      ccatunder: ['', Validators.required],
      cCatUnderName: ['', Validators.nullValidator],
    });
  }

  ngAfterViewInit() {
    this.ename?.nativeElement.focus();
  }
  ngOnInit(): void {
    this.setValidations();
    this.getMaxCode();
    this.loaddata();
    this.oldid = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.activatedRoute.snapshot.queryParams['type'] == 'edit') {
      this.isCreateCategory = false;

      this.api.get_CategoryDataWithID(this.oldid).subscribe((res) => {
        this.categoryForm.patchValue({
          ccatname: res.catname,
          ccatunder: res.catunder,
        });
        this.catcode = res.catcode;
      });
    }

    this.categoryForm.get('ccatunder')?.valueChanges.subscribe((value) => {
      let stateCode = this.categetoryDropDownData.filter(
        (item) => item.id === value
      );
      this.categoryForm.get('cCatUnderName')?.setValue(stateCode[0].name);
    });
  }

  onClickButton(): void {
    this.router.navigateByUrl('stock-category-list');
  }

  onClickAddButton(): void {
    this.router.navigateByUrl('stock-category-create');
  }

  loaddata() {
    this.api.get_CategoryData().subscribe((res) => {
      this.dataSource = new MatTableDataSource(res);
      this.savedData = res;
      const newMap = new Map();
      res
        .map((item: any) => {
          return {
            name: item.catname,
            id: item.catcode,
          };
        })
        .forEach((item: any) => newMap.set(item.id, item));
      this.categetoryDropDownData = [...newMap.values()];
    });
  }

  async getMaxCode() {
    return new Promise((resolve) => {
      this.api.get_CategoryMaxID().subscribe((res) => {
        this.catcode = res;
        resolve({ action: 'success' });
      });
    });
  }

  submit() {
    if (this.categoryForm.valid) {
      this.loading = true;
      setTimeout(() => {
        this.getMaxCode().then((res) => {
          if (this.isCreateCategory) {
            this.save();
          } else if (!this.isCreateCategory) {
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

  save() {
    this.uniqueID = Guid.create();
    var postData = {
      id: this.uniqueID.value,
      catcode: this.catcode,
      catname: this.categoryForm.value.ccatname,
      catunder: this.categoryForm.value.ccatunder,
      rCreatedDateTime: new Date(),
      rStatus: 'A',
    };
    this.api.Inser_CateData(postData).subscribe({
      next:
        (data) => {
          let dialogRef = this.dialog.open(SuccessmsgComponent, {
            data: 'Stock Category Successfully Saved!',
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
      catcode: this.catcode,
      catname: this.categoryForm.value.ccatname,
      catunder: this.categoryForm.value.ccatunder,
      rCreatedDateTime: new Date(),
      rStatus: 'A',
    };

    this.api.Update_CateData(this.oldid, postdata).subscribe({
      next: (data) => {
        this.loading = false;
        let dialogRef = this.dialog.open(SuccessmsgComponent, {
          data: 'Stock Category Successfully Updated',
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.clear();
          this.loading = false;
          this.router.navigateByUrl('stock-category-list');
        });
      },
      error: (err) => {
        alert('Some Error Occured');
        this.loading = false;
      },
    });
  }

  clear() {
    this.catname = '';
    this.catundercode = '';
    this.loading = false;
    this.selectedID = undefined;
    this.setValidations();
    this.categoryForm.reset();
  }

  //Enter Key Events (Focus)
  catNameEnter(event: any) {
    if (typeof this.catname != 'undefined' && this.catname) {
      {
        this.eunder?.focus();
      }
    }
  }
  catUnderEnter(event: any) {
    if (typeof this.catundercode != 'undefined' && this.catundercode) {
      {
        this.esave?.nativeElement.focus();
      }
    }
  }

  //Dropdown Events
  changeCategory(event: MatSelectChange) {
    this.catundercode = event.value;
    this.ename?.nativeElement.focus();
  }

  //Filter
  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
  }
}
