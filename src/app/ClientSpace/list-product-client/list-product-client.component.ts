import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppServiceService } from '../../app-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-product-client',
  templateUrl: './list-product-client.component.html',
  styleUrl: './list-product-client.component.css'
})
export class ListProductClientComponent {
  productlist!: any[];

  selectedProduct: any;
  showModal!: boolean;
  modalRef: any;
  ProductForm!: FormGroup;
  pageSize = 5;
  currentPage = 1;
  totalPages = 0;
  EditProduct: any = {};  
  fileToUpload: File | null = null;

  get paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.productlist.slice(startIndex, startIndex + this.pageSize);
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


  this.getAllproducts();

  this.ProductForm = this.fb.group({
    file: [null],
    productName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
    stock: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], 
    price: ['', [Validators.required, Validators.pattern('^\\d+(\\.\\d{1,2})?$')]],    
    description: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
    category: ['', Validators.required],
   
  });
}

getAllproducts(): void {
  this.appService.getAllproducts().subscribe((data: any[]) => {
    const filteredProducts = data.filter(product => product.status === 'activate');

    filteredProducts.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB.getTime() - dateA.getTime();
    });
    this.productlist = filteredProducts;


    this.totalPages = Math.ceil(this.productlist.length / this.pageSize);
    console.log(this.productlist);
  });
}


parseDate(dateString: string): Date {
  const parts = dateString.split('/');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; 
  const year = parseInt(parts[2], 10);
  return new Date(year, month, day);
}

getBase64ImageSrc(base64Content: string) {
  return `data:image/png;base64,${base64Content}`;
}

onFileChange(event: any): void {
  if (event.target.files && event.target.files.length) {
    const files: FileList = event.target.files;
    this.ProductForm.get('file')!.setValue(files);
  }
}

Productdetails(id: number) {
  this.router.navigate(['Product', id]);
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
