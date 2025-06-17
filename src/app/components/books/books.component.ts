import { Component, OnInit } from '@angular/core';
import { PurchasedBookDTO, CartItemDTO, BookApiResponse } from '../../interfaces/auth';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, ToastModule, FormsModule, CardModule, ButtonModule, InputTextModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit {
  books: PurchasedBookDTO[] = [];
  newBook: Partial<BookApiResponse> = {};
  userId!: number;
  isAdmin: boolean = false;

  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
    const storedRole = localStorage.getItem('role');

    console.log('Role from storage:', storedRole);
    console.log('isAdmin:', this.isAdmin);

    if (storedUserId) {
      this.userId = parseInt(storedUserId, 10);
    }

    this.isAdmin = storedRole?.toUpperCase() === 'ADMIN';

    this.loadBooks();

  }

  loadBooks(): void {
    this.authService.getAllBooks().subscribe({
      next: (data: BookApiResponse[]) => {
        this.books = data.map(book => ({
          bookId: book.bookId,
          bookTitle: book.title,
          bookAuthor: book.author,
          bookGenre: book.genre,
          priceDTO: book.price,
          quantity: book.availability,
          imageUrl: this.getBookImageUrl(book.title ?? 'Unknown Title')
        }));
      },
      error: err => console.error("Error fetching books: ", err)
    });
  }

  getBookImageUrl(title: string): string {
    switch (title) {
      case 'The Song of Ice and Fire': return '/assets/images/soiaf.jpg';
      case 'Lord of the Rings: The Fellowship of the Ring': return '/assets/images/lotr.jpg';
      case 'The Hobbit': return '/assets/images/hobbit.jpg';
      case 'Outliers': return 'assets/images/outliers.jpg';
      case 'Crime and Punishment': return 'assets/images/cap.jpg';
      case 'Think Like a Monk': return 'assets/images/tlam.jpg';
      case 'Think and Grow Rich': return 'assets/images/tagr.jpg';
      case 'And Then There Were None': return 'assets/images/attwn.jpg';
      case 'Palpasa Cafe' : return 'assets/images/pc.jpg'
      default: return 'https://example.com/default-book.jpg';
    }
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
        book.quantity = (book.quantity || 0) - quantity;
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

  addBook(): void {
    if (!this.newBook.title || !this.newBook.author || !this.newBook.genre || !this.newBook.price || !this.newBook.availability) {
      this.messageService.add({ severity: 'error', summary: 'Missing Fields', detail: 'All fields are required.' });
      return;
    }
    console.log("this.newBook",this.newBook)
    this.authService.addBook(this.newBook).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Book Added', detail: res.message });
        this.loadBooks();
        this.newBook = {};
      },
      error: err => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not add book.' })
    });
  }

  deleteBook(bookId: number): void {
    this.authService.deleteBook(bookId).subscribe({
      next: () => {
        console.log('Book deleted successfully');
        this.loadBooks(); // Refresh the list after deletion
      },
    error: (err) => {
    console.error('Error deleting book:', err?.message || 'Unknown error');
    }
    });

  }
}
