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

    this.authService.getAllMedicines().subscribe({
      next: (data: MedicineApiResponse[]) => {
        this.medicines = data.map(medicine => ({
          medicineName: medicine.medicineName,
          manufacturer: medicine.manufacturer,
          price: medicine.price,
          quantity: medicine.availability,
          imageUrl: `/assets/images/${medicine.medicineName?.toLowerCase().replace(/ /g, '-')}.jpg` || 'https://example.com/default-medicine.jpg'
        }));
      },
      error: err => console.error('Error fetching medicines:', err)
    });
  }

  updateQuantity(medicine: PurchasedMedicineDTO, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value ? parseInt(input.value, 10) : undefined;
    medicine.quantityToAdd = value;
  }

  addToCart(medicine: PurchasedMedicineDTO): void {
    if (!this.userId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please log in to add items to your cart.' });
      return;
    }

    const quantity = medicine.quantityToAdd !== undefined ? medicine.quantityToAdd : 1;
    if (quantity > (medicine.quantity || 0)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Quantity exceeds available stock.' });
      return;
    }

    const cartItem: CartItemDTO = {
      bookTitle: null,
      medicineName: medicine.medicineName,
      quantityDTO: quantity
    };

    this.authService.addToCart(this.userId, cartItem).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `${medicine.medicineName} ${response.message}` });
        medicine.quantityToAdd = undefined;
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add item to cart.' });
      }
    });
  }
}