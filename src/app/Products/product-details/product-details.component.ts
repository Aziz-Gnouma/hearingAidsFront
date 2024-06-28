import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';

import { AppServiceService } from '../../app-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})


export class ProductDetailsComponent {
  productlist!: any[];
  countProduct!: number;
  productdetail: any;
  showModal!: boolean;
  modalRef: any;
  ProductForm!: FormGroup;
  id: any;

  constructor(private formBuilder: FormBuilder ,
    private appService: AppServiceService,
    private modalService: NgbModal,
     private router: Router,
     private route: ActivatedRoute,
     private fb: FormBuilder,
) { }


ngOnInit(): void {

  this.route.snapshot.params['id']
  this.id = this.route.snapshot.params['id'];
  console.log('id employee data:', this.id);
  
  this.getproductById(this.id);
  this.countByProductId(this.id)


}

getBase64ImageSrc(base64Content: string) {
  return `data:image/png;base64,${base64Content}`;
}
getproductById(id : number): void {
  this.appService.getproductById(id).subscribe((data: any[]) => {
    this.productdetail = data ;
    
  });
}

countByProductId(id: number): void {
  this.appService.countByProductId(id).subscribe((data: number) => {

    this.countProduct= data;
  });
}

activeProductById(id: number) {
  const confirmed = confirm('are you sure you want to active this product ?');
  if (confirmed) {
    this.appService.ActiveProduct(id).subscribe(
      () => {
        this.router.navigate(['/ALLDisableProducts']); 
      },
      (error: any) => {
        console.log('Error ', error);
        this.router.navigate(['/ALLDisableProducts']); 
      }
    );
    this.router.navigate(['/ALLDisableProducts']); 
  }
}

DesactiveProductById(id: number) {
  const confirmed = confirm('are you sure you want to desactive this product ?');
  if (confirmed) {
    this.appService.DesactiveProduct(id).subscribe(
      () => {

        this.router.navigate(['/ALLProducts']); 
      },
      (error: any) => {
        console.log('Error ', error);
        this.router.navigate(['/ALLProducts']); 
      }
    );
    this.router.navigate(['/ALLProducts']); 

  }
}



}