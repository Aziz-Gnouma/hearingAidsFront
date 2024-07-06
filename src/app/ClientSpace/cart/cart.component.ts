import { Component, OnInit } from '@angular/core';
import { CartService } from '../../cart.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  flatShippingRate = 7000; // Example flat rate shipping cost in TND
  modalRef: any;
  router: any;

  constructor(private cartService: CartService ,    private modalService: NgbModal,
  ) {}

  ngOnInit() {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });
  }

  calculateSubtotal(): number {
    let subtotal = 0;
    this.cartItems.forEach(item => {
      subtotal += item.price * item.quantity;
    });
    return subtotal;
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.flatShippingRate;
  }
  
  openModal( content: any): void {
    console.log("Opening modal ");
    this.modalRef = this.modalService.open(content, { centered: true });
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }}
    navigateAndClose(route: string) {
      this.closeModal();
      setTimeout(() => {
        this.router.navigate([route]);
      }, 500);    }
    
  getBase64ImageSrc(base64Content: string) {
    return `data:image/png;base64,${base64Content}`;
  }
  updateQuantity(index: number, newQuantity: number) {
    // Update quantity in the cart service
    if (index >= 0 && index < this.cartItems.length) {
      this.cartItems[index].quantity = newQuantity;
      this.cartService.updateCartItem(index, this.cartItems[index]);
    }
  }

  removeItem(index: number) {
    // Remove item from cart
    if (index >= 0 && index < this.cartItems.length) {
      this.cartItems.splice(index, 1);
      this.cartService.setCartItems(this.cartItems);
    }
  }
}
