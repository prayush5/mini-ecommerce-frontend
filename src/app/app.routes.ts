import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ShopComponent } from './components/shop/shop.component';
import { authGuard } from './guards/auth.guard';
import { CartComponent } from './components/cart/cart.component';
import { BooksComponent } from './components/movies/books.component';
import { MedicinesComponent } from './components/medicines/medicines.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  {
    path: 'shop',
    component: ShopComponent,
    canActivate: [authGuard],
    children: [
      { path: 'books', component: BooksComponent },
      { path: 'medicine', component: MedicinesComponent }
    ]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'cart', component: CartComponent},
];