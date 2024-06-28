import { Component, OnInit, AfterViewInit, Renderer2, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AppServiceService } from '../app-service.service';
import { User } from '../User';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { state } from '@angular/animations';

function convertDateFormat(inputDate: string): string {
  const parts = inputDate.split('-');
  if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
  } else {
      return inputDate;
  }
}

function dateOfBirthValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const currentDate = new Date();
  const selectedDate = new Date(control.value);
  if (selectedDate >= currentDate) {
    return { 'futureOrCurrentDate': true };
  }
  
  return null;
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})


export class SignUpComponent implements OnInit {
  userForm!: FormGroup;
  isTabletOrPhoneScreen: boolean = false;
  showConfirmation: boolean = false;
  userData!: User; 
  id!: number;
  step: number = 1;
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
    private appService: AppServiceService, private route : Router,
    private fb: FormBuilder
  ) { }
 

  ngOnInit(): void {
    const userFormGroup = this.fb.group({
      userFirstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]], 
      userLastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      cin: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]], 
      dateOfBirth: ['', [Validators.required, dateOfBirthValidator]],
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

  submitForm() {
    if (this.userForm.valid) {
      const UserData = {
        user: this.userForm.get('user')?.value,        
      };
      UserData.user.dateOfBirth = convertDateFormat(UserData.user.dateOfBirth);
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


 




  onAccept(): void {
    console.log('c accepted')
    if (confirm('Are you sure you want to accept?')) {
      this.showConfirmation = true;
    }
  }

  showDeletedAlert() {
  }
  
}

