import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { CartItemDTO } from '../../interfaces/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  private router = inject(Router);
  goToHome() {
    this.router.navigate(['/home'])
  }
  cartItems: CartItemDTO[] = [];
  userId!: number;
   
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
    console.log('Stored userId:', storedUserId);
    if (storedUserId) {
      this.userId = parseInt(storedUserId, 10);
      console.log('Parsed userId:', this.userId);
      this.loadCartItems();

      this.authService.cart$.subscribe(cartItems => {
      this.cartItems = cartItems;
    });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User not logged in. Please log in to view your cart.' });
    }
  }

    loadCartItems(): void {
    this.authService.getUserCart(this.userId).subscribe({
      next: (items) => {
        this.cartItems = items;
        console.log('Cart items:', this.cartItems);
        if (this.cartItems.length === 0) {
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Your cart is empty.' });
        }
      },
      error: (err) => {
        console.error('Error fetching cart items:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message || 'Failed to load cart items.' });
      }
    });
  }


  logAndRemove(item: CartItemDTO): void {
  console.log('Clicked Remove for item:', item);
  if (item.id != null) {
    this.removeFromCart(item.id);
  } else {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid item ID. Cannot remove.' });
  }
}

removeFromCart(cartItemId: number): void {
  console.log('Removing item with ID:', cartItemId); 
  this.authService.removeFromCart(cartItemId).subscribe({
    next: (message) => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
      this.authService.refreshUserCart(this.userId); // Refresh after removing
    },
    error: (err) => {
      console.error('Error removing item:', err);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to remove item from cart.' });
    }
  });
}


get totalPrice():number{
  return this.cartItems.reduce((total, item)=>{
    const price = item.priceDTO || 0;
    const quantity = item.quantityDTO || 0;
    return total + price * quantity;
  },0);
}

checkout(): void{
  if(this.cartItems.length===0){
    this.messageService.add({severity: 'warn', summary: 'Warning', detail: 'Your cart is empty.'});
    return;
  }
  this.authService.redirectToCheckout(this.cartItems);
}

}