import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppServiceService } from '../../app-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.css'
})
export class ListProductsComponent {
  productlist!: any[];
  searchTerm: string = '';
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


updateProduct(id: number) {
  const confirmed = confirm('are you sure you want to update this product ?');
  if (confirmed) {
  const formData: FormData = new FormData();
  formData.append('productName', this.EditProduct.productName);
  formData.append('stock', this.EditProduct.stock);
  formData.append('price', this.EditProduct.price);
  formData.append('description', this.EditProduct.description);
  
  if (this.fileToUpload) {
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
  }

  this.appService.UpdateProduct(id, formData).subscribe(
    (response) => {
      localStorage.setItem('UserData', JSON.stringify(this.EditProduct));
      this.closeEditModal();
      this.getAllproducts(); 
    },
    (error) => {
      console.error('Failed to update product:', error);
      const errorMessage = error.error?.message || 'An error occurred while updating the product.';
      this.closeEditModal();
      this.getAllproducts();
    }
    
  );
}
}

openModal(product: any, content: any): void {
  console.log("Opening modal for product:", product);
  this.selectedProduct = product;
  this.modalRef = this.modalService.open(content, { centered: true });
}

openEditModal(product: any, content: any) {
  this.EditProduct = { ...product }; 
  this.modalService.open(content, { centered: true });
}

openModal1( content: any): void {

  this.modalRef = this.modalService.open(content, { centered: true });
}

closeEditModal(): void {
  this.modalService.dismissAll();
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
onFileChange2(event: any): void {
  if (event.target.files && event.target.files.length) {
    this.fileToUpload = event.target.files[0];
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
        this.closeModal();
        this.getAllproducts();
      },
      (error) => {
        console.error('Failed to update formation:', error);
        alert('Product saved successfully');
        this.router.navigate(['/ALLProducts'])
        this.closeModal1();

      }
    );
    this.closeModal();
    this.resetForm();
  } else {
    console.log('Form is invalid');
    this.markFormGroupTouched(this.ProductForm);
  }
}
resetForm() {
  this.ProductForm.reset({
    productName: '',
    price: '',
    description: '',
    file: null
  });
  this.ProductForm.markAsUntouched();
  this.ProductForm.markAsPristine();
  this.closeModal1();
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

}