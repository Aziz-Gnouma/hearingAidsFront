import { Component } from '@angular/core';
import { CartService } from '../cart.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-app-hedear',
  templateUrl: './app-hedear.component.html',
  styleUrl: './app-hedear.component.css'
})
export class AppHedearComponent {

  cartCount: number = 0; 
  cartItems: any[] = []; 
  showCart: boolean = false;
  modalRef: any;
  router: any;
  constructor(private cartService: CartService ,    private modalService: NgbModal,
     private AuthService: AuthService,
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.cartCount = this.cartItems.length; // Update cart count
    });
  }

  getBase64ImageSrc(base64Content: string) {
    return `data:image/png;base64,${base64Content}`;
  }
  calculateSubtotal(): number {
    let subtotal = 0;
    this.cartItems.forEach(item => {
      subtotal += item.price * item.quantity;
    });
    return subtotal;
  }
  calculateCartCount(items: any[]): number {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }

  toggleCart() {
    this.showCart = !this.showCart;
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

  updateQuantity(item: any, quantity: number) {
    this.cartService.updateCartItem(item.id, quantity); 
  }

  removeItem(item: any) {
    this.cartService.removeCartItem(item.id); 
  }
  public isLoggedIn() {
    return this.AuthService.isLoggedIn();
  }

  public logout() {
    this.AuthService.clear();
    this.router.navigate(['']);
  }
}
