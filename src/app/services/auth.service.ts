import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookApiResponse, CartItemDTO, MedicineApiResponse, PurchasedBookDTO, RegisterPostData, User } from '../interfaces/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/api/user'; 
  private cartUrl = "http://localhost:8080/api/cart";
  private bookUrl = 'http://localhost:8080/api/book';
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<User> {
    const loginData = { email, password };
    return this.http.post<User>(`${this.baseUrl}/login`, loginData);
  }

  registerUser(postData: RegisterPostData): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/save`, postData);
  }

  getUserDetails(email: string, password: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}?email=${email}&password=${password}`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/get/${id}`);
  }

  getUserCart(userId: number): Observable<CartItemDTO[]> {
    return this.http.get<CartItemDTO[]>(`${this.cartUrl}/user/${userId}`);
  }

  getAllBooks(): Observable<BookApiResponse[]> {
    return this.http.get<BookApiResponse[]>(this.bookUrl);
  }

  getAllMedicines(): Observable<MedicineApiResponse[]> {
    return this.http.get<MedicineApiResponse[]>(`${this.baseUrl}/medicine`); 
  }

  addToCart(userId: number, cartItem: CartItemDTO): Observable<{ message: string }> {
  return this.http.post<{ message: string }>(`${this.cartUrl}/add?userId=${userId}`, cartItem);
  }

  removeFromCart(cartItemId: number): Observable<string> {
  return this.http.delete(`${this.cartUrl}/remove/${cartItemId}`, { responseType: 'text'});
  }
}