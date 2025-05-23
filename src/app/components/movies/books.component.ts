import { Component, OnInit } from '@angular/core';
import { PurchasedBookDTO, CartItemDTO, BookApiResponse } from '../../interfaces/auth';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, ToastModule, FormsModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit {
  books: PurchasedBookDTO[] = [];
  userId!: number;
  quantities: { [key: string]: number | null } = {};

  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      this.userId = parseInt(storedUserId, 10);
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User not logged in.' });
    }

    this.authService.getAllBooks().subscribe({
      next: (data: BookApiResponse[]) => {
        this.books = data.map(book => {
          let imageUrl = '';
          switch (book.title) {
            case 'The Song of Ice and Fire':
              imageUrl = '/assets/images/soiaf.jpg';
              break;
            case 'Lord of the Rings: The Fellowship of the Ring':
              imageUrl = '/assets/images/lotr.jpg';
              break;
            case 'The Hobbit':
              imageUrl = '/assets/images/hobbit.jpg';
              break;
            case 'Outliers':
              imageUrl = 'assets/images/outliers.jpg';
              break;
            case 'Crime and Punishment':
              imageUrl = 'assets/images/cap.jpg';
              break;
            case 'Think Like a Monk':
              imageUrl = 'assets/images/tlam.jpg';
              break;
            default:
              imageUrl = 'https://example.com/default-book.jpg';
          }

          return {
            bookTitle: book.title,
            bookAuthor: book.author,
            bookGenre: book.genre,
            priceDTO: book.price,
            quantity: book.availability,
            imageUrl: imageUrl
          };
        });
      },
      error: err => console.error("Error fetching books: ", err)
    });
  }

  
addToCart(book: PurchasedBookDTO): void {
  if (!this.userId) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please log in to add items to your cart.' });
    return;
  }

  const quantity = book.quantityToAdd !== undefined ? book.quantityToAdd : 1;
  if (quantity > (book.quantity || 0)) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Quantity exceeds available stock.' });
    return;
  }

  const cartItem: CartItemDTO = {
    bookTitle: book.bookTitle,
    medicineName: null,
    quantityDTO: quantity
  };

  this.authService.addToCart(this.userId, cartItem).subscribe({
    next: (response) => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `${book.bookTitle} ${response.message}` });
      book.quantity=(book.quantity || 0) - quantity;
      book.quantityToAdd = undefined;
    },
    error: (err) => {
      console.error('Error adding to cart:', err);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add item to cart.' });
    }
  });
}

updateQuantity(book: PurchasedBookDTO, event: Event): void {
  const input = event.target as HTMLInputElement;
  const value = input.value ? parseInt(input.value, 10) : undefined;
  book.quantityToAdd = value;

  
}
}