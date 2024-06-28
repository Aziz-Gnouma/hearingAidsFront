import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppServiceService } from '../app-service.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  Userslist!: any[];
  searchTerm: string = '';
  selectedProduct: any;
  showModal!: boolean;
  modalRef: any;
  ProductForm!: FormGroup;
  pageSize = 5;
  currentPage = 1;
  totalPages = 0;
  countActiveUser!: number;
  ALLUser!: number;
  selectedUser: any;
  Orders!: any[];
  Orderlength!: number;


  get paginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.Userslist.slice(startIndex, startIndex + this.pageSize);
  }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  constructor(private formBuilder: FormBuilder ,
    private appService: AppServiceService,
    private modalService: NgbModal,
     private route : Router,
     private fb: FormBuilder,
     private router: Router,
) { }


ngOnInit(): void {


  this.getAllUsers();

  this.getCountActiveUser();

 
}

getAllUsers(): void {
  this.appService.getAllUsers().subscribe((data: any[]) => {
    const filteredUsers = data.filter(user => user.role[0].roleName === 'User');

    this.Userslist= filteredUsers;

    this.totalPages = Math.ceil(this.Userslist.length / this.pageSize);
    this.ALLUser =this.Userslist.length;
    console.log(this.Userslist);
  });

  
}

getCountActiveUser(): void {
  this.appService.conuntActiveUser().subscribe((data: number) => {

    this.countActiveUser= data;
  });
}

getOrdersById(id: number): void {
  this.appService.getOrdersById(id).subscribe((data: any[]) => {

    this.Orders= data;
    this.Orderlength = data.length;
    console.log('orders',this.Orders)
  });
}


parseDate(dateString: string): Date {
  const parts = dateString.split('/');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; 
  const year = parseInt(parts[2], 10);
  return new Date(year, month, day);
}

openModal(user: any, content: any): void {
  console.log("Opening modal for user:", user);
  this.selectedUser = user;
  this.getOrdersById(this.selectedUser.id)
  console.log('ok',this.selectedUser)
  this.modalRef = this.modalService.open(content, { centered: true });
}





closeModal(): void {
  if (this.modalRef) {
    this.modalRef.close();
  }}



getBase64ImageSrc(base64Content: string) {
  return `data:image/png;base64,${base64Content}`;
}

onFileChange(event: any): void {
  if (event.target.files && event.target.files.length) {
    const files: FileList = event.target.files;
    this.ProductForm.get('file')!.setValue(files);
  }
}



SuprimerProduct(id: number) {
  const confirmed = confirm('are you sure you want to delete this product ?');
  if (confirmed) {
    this.appService.supprimerProduct(id).subscribe(
      () => {

this.getAllUsers();
      },
      (error: any) => {
        console.log('Error ', error);
      }
    );
  }
          //  this.getGerantList();

}


markFormGroupTouched(formGroup: FormGroup) {
  Object.values(formGroup.controls).forEach(control => {
    control.markAsTouched();

    if (control instanceof FormGroup) {
      this.markFormGroupTouched(control);
    }
  });
}

SuprimerUser(id: number) {
  const confirmed = confirm('are you sure you want to delete this user ?');
  if (confirmed) {
    this.appService.DeleteUser(id).subscribe(
      () => {

this.getAllUsers();
      },
      (error: any) => {
        console.log('Error ', error);
      }
    );
  }
}


ArchiverUser(id: number) {
  const confirmed = confirm('are you sure you want to archiver this user ?');
  if (confirmed) {
    this.appService.ActiveUser(id).subscribe(
      () => {

this.getAllUsers();
      },
      (error: any) => {
        console.log('Error ', error);
      }
    );
  }
}
}