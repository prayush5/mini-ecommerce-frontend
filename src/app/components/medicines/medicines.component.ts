// medicines.component.ts
import { Component, OnInit } from '@angular/core';
import { PurchasedMedicineDTO, CartItemDTO, MedicineApiResponse } from '../../interfaces/auth';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-medicines',
  standalone: true,
  imports: [CommonModule, ToastModule, FormsModule],
  templateUrl: './medicines.component.html',
  styleUrl: './medicines.component.css'
})
export class MedicinesComponent implements OnInit {
  medicines: PurchasedMedicineDTO[] = [];
  userId!: number;
  quantities: { [key: string]: number | null } = {};

  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
  const storedUserId = localStorage.getItem('userId');
  if (storedUserId) {
    this.userId = parseInt(storedUserId, 10);
  } else {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User not logged in.' });
  }

  this.authService.getAllMedicines().subscribe({
    next: (data: MedicineApiResponse[]) => {
      this.medicines = data.map(medicine => ({
        name1: medicine.name,
        stockQuantity1: medicine.stockQuantity,
        price: medicine.price,
        manufacturer: medicine.manufacturer,
        expiryDate: medicine.expiryDate,
        imageUrl: this.getImageUrl(medicine.name), 
      }));
      console.log('Mapped medicines:', this.medicines);
    },
    error: err => {
      console.error("Error fetching medicines: ", err);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load medicines.' });
    }
  });
}

private getImageUrl(medicineName: string): string {
  switch (medicineName) {
    case 'Cetamol':
      return 'assets/images/cetamol.jpg';
    case 'Ibuprofen':
      return 'assets/images/ibu.jpg';
    case 'Amoxicillin':
      return 'assets/images/amox.jpg';
    case 'Cetirizine':
      return 'assets/images/cet.jpg';
    case 'Azithromycin':
      return 'assets/images/azi.jpg';
    case 'Metformin':
      return 'assets/images/met.jpg';
    default:
      return 'https://via.placeholder.com/150';
  }
}

  updateQuantity(medicine: PurchasedMedicineDTO, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value ? parseInt(input.value, 10) : undefined;
    medicine.quantityToAdd = value;
  }

  addToCart(medicines: PurchasedMedicineDTO): void {
    if (!this.userId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please log in to add items to your cart.' });
      return;
    }

    const quantity = medicines.quantityToAdd !== undefined ? medicines.quantityToAdd : 1;
    if (quantity > (medicines.stockQuantity1 || 0)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Quantity exceeds available stock.' });
      return;
    }

    const cartItem: CartItemDTO = {
      bookTitle: null,
      medicineName: medicines.name1,
      quantityDTO: quantity
    };

    this.authService.addToCart(this.userId, cartItem).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `${medicines.name1} ${response.message}` });
        medicines.stockQuantity1=(medicines.stockQuantity1 || 0) - quantity;
        medicines.quantityToAdd = undefined;
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add item to cart.' });
      }
    });
  }
}