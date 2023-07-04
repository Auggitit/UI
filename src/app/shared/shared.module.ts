import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { 
          MatDialogModule,
          MatDialog,
          MatDialogRef,
          MAT_DIALOG_DATA
} from '@angular/material/dialog';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectBoxComponent } from './components/mat-select-box/mat-select-box.component';
import { MatHeaderComponent } from './components/mat-header/mat-header.component';
import { MatButtonComponent } from './components/mat-button/mat-button.component';
import { MatAreaGraphComponent } from './components/mat-area-graph/mat-area-graph.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ContentCardsComponent } from './components/content-cards/content-cards.component';
import { ReportsHeaderComponent } from './components/reports-header/reports-header.component';
import { MatTableComponent } from './components/mat-table/mat-table.component';
import { InputAutoCompleteComponent } from './components/input-auto-complete/input-auto-complete.component';
import { TableFiltersComponent } from './components/table-filters/table-filters.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmationDialogBoxComponent } from './components/confirmation-dialog-box/confirmation-dialog-box.component';
import { ExportPdfDialogBoxComponent } from './components/export-pdf-dialog-box/export-pdf-dialog-box.component';
import { TableColumnDisplayFilterComponent } from './components/table-column-display-filter/table-column-display-filter.component';

@NgModule({
  declarations: [
    MatSelectBoxComponent,
    MatHeaderComponent,
    MatButtonComponent,
    MatAreaGraphComponent,
    ContentCardsComponent,
    ReportsHeaderComponent,
    MatTableComponent,
    InputAutoCompleteComponent,
    TableFiltersComponent,
    SearchBoxComponent,
    ConfirmationDialogBoxComponent,
    ExportPdfDialogBoxComponent,
    TableColumnDisplayFilterComponent,
  ],
  imports: [
    CommonModule,
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
    NgApexchartsModule,
    ReactiveFormsModule,
    MatMenuModule,

  ],
  exports: [
    MatSelectBoxComponent,
    MatButtonComponent,
    MatHeaderComponent,
    MatAreaGraphComponent,
    ContentCardsComponent,
    ReportsHeaderComponent,
    MatTableComponent,
    MatFormFieldModule,
    InputAutoCompleteComponent,
    TableFiltersComponent,
    MatMenuModule,
    MatDialogModule
  ],
})
export class SharedModule {}
