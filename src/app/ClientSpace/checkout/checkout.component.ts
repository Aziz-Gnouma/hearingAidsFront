import { Component, OnInit, AfterViewInit, Renderer2, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { state } from '@angular/animations';
import { AppServiceService } from '../../app-service.service';
import { CartService } from '../../cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  userForm!: FormGroup;
  cartItems: any[] = [];
countries: string[] = ['USA', 'Canada'];
states: string[] = [];
usaStates: string[] = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida',
  'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
  'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah',
  'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

canadaStates: string[] = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia', 'Ontario',
  'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Northwest Territories', 'Nunavut', 'Yukon'
];
constructor(
  private appService: AppServiceService, private route : Router,private cartService: CartService,
  private fb: FormBuilder
) { }


ngOnInit(): void {
  const userFormGroup = this.fb.group({
    userFirstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]], 
    userLastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
    cin: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]], 
    pays: ['', [ Validators.pattern('^(USA|Canada)$')]], 
          state: ['', Validators.required],           
    phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    address: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
    codePostal: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    userPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  this.userForm = this.fb.group({
    user: userFormGroup,
  });

  this.userForm.get('user.pays')?.valueChanges.subscribe(country => {
    this.updateStateValidators(country);
  });
  this.cartService.getCartItems().subscribe(items => {
    this.cartItems = items;
  });

}
updateStateValidators(country: string) {
  const stateControl = this.userForm.get('user.state');
  if (stateControl) { 
    if (country === 'USA') {
      stateControl.setValidators([Validators.required]);
      this.states = this.usaStates;
    } else if (country === 'Canada') {
      stateControl.setValidators([Validators.required]);
      this.states = this.canadaStates;
    } else {
      stateControl.clearValidators();
      this.states = [];
    }
    stateControl.updateValueAndValidity();
  }
}
CountryChange(event: any) {
  const selectedCountry = event.target.value;
  this.userForm.get('user.pays')?.setValue(selectedCountry);
  this.updateStateValidators(selectedCountry); // Update state validators based on country
}

onCountryChange(event: any) {
  const selectedCountry = event.target.value;
  if (selectedCountry === 'USA') {
    this.states = this.usaStates;
  } else if (selectedCountry === 'Canada') {
    this.states = this.canadaStates;
  } else {
    this.states = [];
  }
}
calculateSubtotal(): number {
  let subtotal = 0;
  this.cartItems.forEach(item => {
    subtotal += item.price * item.quantity;
  });
  return subtotal;
}



submitForm() {
  if (this.userForm.valid) {
    const UserData = {
      user: this.userForm.get('user')?.value,        
    };
    console.log('This is my bd:', UserData);
    
    this.appService.SaveUser(UserData).subscribe(
      data => {
        console.log('user saved successfully', data);
        this.route.navigate(['/']);
        // Handle success
      },
      
      error => {
        console.error('Error creating user', error);
        if (typeof error === 'string') {
          alert(error);
        } else {
          alert('Verify user data , email or CIN already exists.');
        }
      }
    );
    

  } else {
    console.log('Form is invalid');
    this.markFormGroupTouched(this.userForm);
  }
}




markFormGroupTouched(formGroup: FormGroup) {
  Object.values(formGroup.controls).forEach(control => {
    control.markAsTouched();

    if (control instanceof FormGroup) {
      this.markFormGroupTouched(control);
    }
  });
}


}
