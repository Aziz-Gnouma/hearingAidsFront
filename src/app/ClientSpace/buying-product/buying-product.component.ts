import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';

import { AppServiceService } from '../../app-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from '../../cart.service';

@Component({
  selector: 'app-buying-product',
  templateUrl: './buying-product.component.html',
  styleUrl: './buying-product.component.css'
})
export class BuyingProductComponent {
  productlist!: any[];
  countProduct!: number;
  productdetail: any;
  showModal!: boolean;
  modalRef: any;
  ProductForm!: FormGroup;
  id: any;
  quantity: number = 1;
Math: any;

  constructor(private formBuilder: FormBuilder ,
    private appService: AppServiceService,
    private cartService: CartService,
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
}
addToCart() {
  this.cartService.addToCart(this.productdetail, this.quantity);
  console.log('Added to cart:', this.productdetail, this.quantity);
}

getBase64ImageSrc(base64Content: string) {
  return `data:image/png;base64,${base64Content}`;
}
getproductById(id : number): void {
  this.appService.getproductById(id).subscribe((data: any[]) => {
    this.productdetail = data ;
    
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
}
