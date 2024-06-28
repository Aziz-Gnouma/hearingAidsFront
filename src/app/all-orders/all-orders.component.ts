import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppServiceService } from '../app-service.service';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.css'
})
export class AllOrdersComponent {
  orderlist!: any[];
  searchTerm: string = '';
  selectedProduct: any;
  showModal!: boolean;
  modalRef: any;
  ProductForm!: FormGroup;
  pageSize = 5;
  currentPage = 1;
  totalPages = 0;
Math: any;
sumPricesCurrentMonth: any;
sumPricesAllOrders: any;
  totalCount!: number;

  get paginatedOrders() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.orderlist.slice(startIndex, startIndex + this.pageSize);
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


  this.getAllorders();


}

getAllorders(): void {
  this.appService.getAllorders().subscribe((data: any[]) => {
    this.orderlist = data.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      
      return dateB.getTime() - dateA.getTime();
    });
    
    this.totalPages = Math.ceil(this.orderlist.length / this.pageSize);
    console.log(this.orderlist);
     this.totalCount = this.orderlist.length;
     this.sumPricesAllOrders = this.orderlist.reduce((sum, order) => 
      sum + parseFloat(order.price), 0
    );
    
    const currentMonth = new Date().getMonth() + 1; // Month index (1 for January)
    const currentYear = new Date().getFullYear();
    
    console.log("Current Month:", currentMonth);
    console.log("Current Year:", currentYear);
    
    // Helper function to parse DD/MM/YYYY date format
    const parseDate = (dateString: string) => {
      const [day, month, year] = dateString.split('/');
      return new Date(`${year}-${month}-${day}T00:00:00`);
    };
    
    // Filter orders for the current month and year that are paid
    const paidOrdersInCurrentMonth = this.orderlist.filter(order => {
      const rawOrderDate = order.purchaseDate;
      console.log("Raw Order Date:", rawOrderDate);
    
      const orderDate = parseDate(rawOrderDate);
      console.log("Parsed Order Date:", orderDate);
    
      const orderMonth = orderDate.getMonth() + 1; // Adjust order date month index
      const orderYear = orderDate.getFullYear();
    
      console.log(`Order Date: ${orderDate}, Order Month: ${orderMonth}, Order Year: ${orderYear}`);
    
      return (
        orderMonth === currentMonth &&
        orderYear === currentYear
      );
    });
    
    console.log("Filtered Orders in Current Month: ", paidOrdersInCurrentMonth);
    
    this.sumPricesCurrentMonth = paidOrdersInCurrentMonth.reduce((sum, order) => {
      const orderPrice = parseFloat(order.price); // Parse the price to ensure it's a number
      console.log(`Order Price: ${order.price}, Parsed Price: ${orderPrice}, Sum So Far: ${sum}`);
    
      return sum + (isNaN(orderPrice) ? 0 : orderPrice); // Handle NaN gracefully
    }, 0);
    
    console.log("Sum of prices in the current month: ", this.sumPricesCurrentMonth);
    


    console.log("Sum of prices All orders: ", this.sumPricesAllOrders);
  
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





markFormGroupTouched(formGroup: FormGroup) {
  Object.values(formGroup.controls).forEach(control => {
    control.markAsTouched();

    if (control instanceof FormGroup) {
      this.markFormGroupTouched(control);
    }
  });
}
}

