export class Methods{
    onInputChange(event: any) {
        const inputElement = event.target;
        const value = inputElement.value;  
        inputElement.setSelectionRange(value.length, value.length);
      }

      Empty(event: any) {
        console.log(event)
         if (event.target.value ===  "0") {
           event.target.value = '';
         }     
       }
       return(event: any) {
        
           if (event.target.value === '') {
             event.target.value = 0;    
           }
       }
}
