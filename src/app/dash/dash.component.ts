import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppServiceService } from '../app-service.service';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrl: './dash.component.css'
})
export class DashComponent {


  orderlist!: any[];

  selectedProduct: any;


Math: any;
sumPricesCurrentMonth: any;
sumPricesAllOrders: any;
  totalCount!: number;
  ALLUser!: number;
  conuntProduct!: Number;


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
    this.orderlist = data;
     this.totalCount = this.orderlist.length;
     this.sumPricesAllOrders = this.orderlist.reduce((sum, order) => 
      sum + parseFloat(order.price), 0
    );
    
    const currentMonth = new Date().getMonth() + 1; 
    const currentYear = new Date().getFullYear();

    const parseDate = (dateString: string) => {
      const [day, month, year] = dateString.split('/');
      return new Date(`${year}-${month}-${day}T00:00:00`);
    };
    
    const paidOrdersInCurrentMonth = this.orderlist.filter(order => {
      const rawOrderDate = order.purchaseDate;
      console.log("Raw Order Date:", rawOrderDate);
    
      const orderDate = parseDate(rawOrderDate);
      console.log("Parsed Order Date:", orderDate);
    
      const orderMonth = orderDate.getMonth() + 1;
      const orderYear = orderDate.getFullYear();
      return (
        orderMonth === currentMonth &&
        orderYear === currentYear
      );
    });
    
    this.sumPricesCurrentMonth = paidOrdersInCurrentMonth.reduce((sum, order) => {
      const orderPrice = parseFloat(order.price); 
    
      return sum + (isNaN(orderPrice) ? 0 : orderPrice); 
    }, 0);

  
  });

  this.appService.getAllUsers().subscribe((data: any[]) => {
    const filteredUsers = data.filter(user => user.role[0].roleName === 'User');

    this.ALLUser =filteredUsers.length;
  });
  this.appService.conuntProduct().subscribe((data: Number) => {
    this.conuntProduct = data;

  });
}

}
