import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ShopComponent } from './components/shop/shop.component';
import { authGuard } from './guards/auth.guard';
import { CartComponent } from './components/cart/cart.component';
import { BooksComponent } from './components/books/books.component';
import { MedicinesComponent } from './components/medicines/medicines.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AgentHomeComponent } from './agent-home/agent-home.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'shop',
    component: ShopComponent,
    // canActivate: [authGuard],
    children: [
      { path: 'books', component: BooksComponent },
      { path: 'medicine', component: MedicinesComponent }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'cart', component: CartComponent},
  { path:'admin-home', component: AdminHomeComponent },
  { path: 'admin-home/books', component: BooksComponent },        
  { path: 'admin-home/medicine', component: MedicinesComponent },
  { path:'agent-home', component: AgentHomeComponent },
  { path: 'agent-home/books', component: BooksComponent },       
  { path: 'agent-home/medicine', component: MedicinesComponent },
];