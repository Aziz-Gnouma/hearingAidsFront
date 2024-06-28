import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppServiceService } from '../../app-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-disable-product',
  templateUrl: './list-disable-product.component.html',
  styleUrl: './list-disable-product.component.css'
})
export class ListDisableProductComponent {
  productlist!: any[];
  searchTerm: string = '';

  selectedProduct: any;
  showModal!: boolean;
  modalRef: any;
  ProductForm!: FormGroup;
  pageSize = 5;
  currentPage = 1;
  totalPages = 0;

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
    const filteredProducts = data.filter(product => product.status === 'desactivate');

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

openModal(product: any, content: any): void {
  console.log("Opening modal for product:", product);
  this.selectedProduct = product;
  this.modalRef = this.modalService.open(content, { centered: true });
}

openModal1( content: any): void {

  this.modalRef = this.modalService.open(content, { centered: true });
}


closeModal1(): void {
  if (this.modalRef) {
    this.modalRef.close();
  }}

closeModal(): void {
  console.log("Closing modal");
  this.showModal = false;
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

submitForm() {
  if (this.ProductForm.valid) {
    const formData = new FormData();
  

    Object.keys(this.ProductForm.value).forEach(key => {
      if (key !== 'file') {
        formData.append(key, this.ProductForm.get(key)!.value);
      }
    });

    const files: FileList = this.ProductForm.get('file')!.value;
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }

    console.log('Form data:', formData);

    this.appService.SaveProduct(formData).subscribe(
      data => {
        console.log('Product saved successfully', data);
        alert('Product saved successfully');
        this.closeModal1();
        this.getAllproducts();
      },
      (error) => {
        console.error('Failed to update formation:', error);
        alert('Product saved successfully');
        this.router.navigate(['/ALLProducts'])
    
      }
    );
  } else {
    console.log('Form is invalid');
    this.markFormGroupTouched(this.ProductForm);
  }
}

Productdetails(id: number) {
  this.router.navigate(['DetailsEmplyee', id]);
}
SuprimerProduct(id: number) {
  const confirmed = confirm('are you sure you want to delete this product ?');
  if (confirmed) {
    this.appService.supprimerProduct(id).subscribe(
      () => {

this.getAllproducts();
      },
      (error: any) => {
        console.log('Error ', error);
      }
    );
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