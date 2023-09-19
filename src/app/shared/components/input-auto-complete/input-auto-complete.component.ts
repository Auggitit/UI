import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormControlName } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
@Component({
  selector: 'app-input-auto-complete',
  templateUrl: './input-auto-complete.component.html',
  styleUrls: ['./input-auto-complete.component.scss'],
})
export class InputAutoCompleteComponent implements OnInit {
  @Input() optionsList!: any;
  @Input() groupName!: any;
  @Input() controlName!: FormControlName | any;
  @Input() inputWidth: string = '150px';
  filteredSearchValues!: any[];
  vendorAutoCompleteValue: FormControl = new FormControl(''); //for testing

  constructor() {}

  ngOnInit(): void {
    this.vendorAutoCompleteValue?.valueChanges?.subscribe((value) => {
      if (!value) {
        this.groupName.get(this.controlName)?.setValue('');
      }
      this.filteredSearchValues = this.filterValues(value || '');
    });
  }

  private filterValues(value: any): string[] {
    const valueToBeFiltered = value.toLowerCase();
    return this.optionsList.filter((option: any) => {
      return option.name.toLowerCase().includes(valueToBeFiltered);
    });
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const selectedValue = this.filteredSearchValues.find(
      (item) => item.name === event.option.value
    );
    this.groupName.get(this.controlName)?.setValue(selectedValue.id);
  }
}
