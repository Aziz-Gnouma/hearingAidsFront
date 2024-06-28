import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { AppServiceService } from '../app-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


function formatDateToString(date: string): string {
  if (date && date.includes('-')) {
    // Split the date string into parts using "-"
    const parts = date.split('-');
    // Reformat the date to "dd/MM/yyyy" format
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  // If date is not provided or not in the expected format, return it as is
  return date;
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  userData: any; 
  userForm!: FormGroup;
  step: number = 1;
  modalRef: any;
  selectedProfile: any;


  constructor(
    private appServiceService: AppServiceService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private AuthService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const storedUserData = localStorage.getItem('UserData');
  
    if (storedUserData !== null) {
      this.userData = JSON.parse(storedUserData); 
      console.log('UserData', this.userData);
      this.createForm(); 
    } else {
      console.error('User Data not found in local storage...'); 
    }

  }
  initialPasswordValue: string | null = null;
  get fullName(): string {
    return `${this.userData.userFirstName} ${this.userData.userLastName}`;
  }
  createForm() {
    this.userForm = this.formBuilder.group({
      userFirstName: [this.userData.userFirstName, Validators.required],
      userLastName: [this.userData.userLastName, Validators.required],
      email: [this.userData.email, [Validators.required, Validators.email]],
      userPassword: [this.userData.userPassword, [Validators.required]],
      dateOfBirth: [this.userData.dateOfBirth],
      phoneNumber: [this.userData.phoneNumber],
      pays: [this.userData.nationality],
      address: [this.userData.address],
      CodePostal: [this.userData.locality]
    });
    this.initialPasswordValue = this.userForm.get('userPassword')?.value;

    this.userForm.valueChanges.subscribe(() => {
      this.userForm.patchValue(this.userData);
    });
  }
  

  

  updateProfile() {
    if (this.userForm.valid) {
        let dateOfBirth = this.userForm.get('dateOfBirth')?.value;
  
        // Format the date of birth as "dd/MM/yyyy"
        if (dateOfBirth) {
            dateOfBirth = formatDateToString(dateOfBirth);
        }
  
        // Update the dateOfBirth field in the form with the formatted date
        this.userForm.patchValue({ dateOfBirth });
  
    
    
        let updatedUserData = this.userForm.value;
        const newPassword = this.userForm.get('userPassword')?.value;
        const isPasswordDirty = this.userForm.get('userPassword')?.dirty;

        const isPasswordModified = this.initialPasswordValue !== newPassword;
        console.log("Updated User Data with formatted dateOfBirth:", updatedUserData);

        if (isPasswordModified) {
            updatedUserData.userPassword = newPassword;
        } else {
            delete updatedUserData.userPassword;
        }

        delete updatedUserData.dateOfBirth;

        const userId = this.userData.id;
  
        console.log('Final Updated UserData:', updatedUserData);
  
        this.appServiceService.UpdateProfile(userId, updatedUserData).subscribe(
            (response) => {
                console.log('Profile updated successfully:', response);
                this.userData = updatedUserData;
                localStorage.setItem('UserData', JSON.stringify(updatedUserData));
                this.closeModal();
                this.resetForm();
            },
            (error) => {
                console.error('Failed to update profile:', error);
                const errorMessage = error.error ? error.error : 'An error occurred while updating profile.';
                console.error('Error response:', errorMessage);
                this.closeModal();
                this.resetForm();
            }
        );
        this.closeModal();
        this.resetForm();
    } else {
        console.error('Form is invalid');
    }
}

  
openModal(userData: any, content: any): void {
 this.selectedProfile = this.userData;
 console.log('this userdata :',this.userData);
 console.log('this selectedprof :',this.selectedProfile);

  this.modalRef = this.modalService.open(content, { centered: true });
}





closeModal(): void {
  if (this.modalRef) {
    this.modalRef.close();
  }}
  resetForm() {
    this.userForm.reset({
      phoneNumber: [this.userData.phoneNumber],
      pays: [this.userData.nationality],
      address: [this.userData.address],
      CodePostal: [this.userData.locality]
    });
    this.userForm.markAsUntouched();
    this.userForm.markAsPristine();
    this.closeModal();
  }

  ArchiverUser(id: number) {
    const confirmed = confirm('are you sure you want to archiver your account ?');
    if (confirmed) {
      this.appServiceService.ActiveUser(id).subscribe(
        () => {
  
  this.logout();
        },
        (error: any) => {
          console.log('Error ', error);
          this.logout();

        }
      );
      this.logout();

    }
  }

  public logout() {
    this.AuthService.clear();
    this.router.navigate(['/']);
  }
}
