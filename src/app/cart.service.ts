import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  private cartItems: any[] = [];

  constructor() {
    // Initialize with items from localStorage if available
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      this.cartItems = JSON.parse(savedCartItems);
      this.cartItemsSubject.next(this.cartItems);
    }
  }

  getCartItems(): Observable<any[]> {
    return this.cartItemsSubject.asObservable();
  }

  addToCart(product: any, quantity: number) {
    const cartItem = { ...product, quantity };
    this.cartItems.push(cartItem);
    this.cartItemsSubject.next([...this.cartItems]);

    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }
  updateCartItem(index: number, updatedItem: any) {
    if (index >= 0 && index < this.cartItems.length) {
      this.cartItems[index] = updatedItem;
      this.cartItemsSubject.next([...this.cartItems]);
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));

    }
  }

  removeCartItem(index: number) {
    if (index >= 0 && index < this.cartItems.length) {
      this.cartItems.splice(index, 1);
      this.cartItemsSubject.next([...this.cartItems]);
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));

    }
  }

  setCartItems(items: any[]) {
    this.cartItems = items;
    this.cartItemsSubject.next([...this.cartItems]);
    
  }
}
