import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appPreventSpecialCharacters]'
})
export class PreventSpecialCharactersDirective {
  @HostListener('input', ['$event'])
  onInput(event: any) {
    const input = event.target as HTMLInputElement;
    const inputValue = input.value;
    const newValue = inputValue.replace(/[^\w\s]/gi, ''); // Replace special characters with empty string
    if (newValue !== inputValue) {
      input.value = newValue;
      event.preventDefault(); // Prevent the input event from propagating further
    }
  }
}