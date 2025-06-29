import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookApiResponse, CartItemDTO, MedicineApiResponse, PurchasedBookDTO, RegisterPostData, User } from '../interfaces/auth';
import { Observable } from 'rxjs';
import { loadStripe } from '@stripe/stripe-js';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/api/user'; 
  private cartUrl = "http://localhost:8080/api/cart";
  private bookUrl = 'http://localhost:8080/api/book';
  private medicineUrl = 'http://localhost:8080/api/medicines';

  private cartSubject = new BehaviorSubject<CartItemDTO[]>([]);
  cart$ = this.cartSubject.asObservable();

  stripePromise = loadStripe('pk_test_51RfD3HP7JdwML9HE3hacuFpSHbmdcRxdrg78PPh3SS8nd0ZI4or6qgRydk554jMchTzKyCcDXAh53NSNWOCPFhIZ00K1d0SBxj');

  constructor(private http: HttpClient) {}

  async redirectToCheckout(cartItems : any[]){
    const stripe = await this.stripePromise;
    this.http.post<any>('http://localhost:8080/api/stripe/create-session', cartItems).subscribe(async (res) => {
      if(res.url){
        window.location.href = res.url;
      }
    });
  }
  
  refreshUserCart(userId: number){
    this.getUserCart(userId).subscribe(cart => {
      this.cartSubject.next(cart);
    });
  }

  clearLocalCart(){
    this.cartSubject.next([]);
  }

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
    return this.http.get<MedicineApiResponse[]>(this.medicineUrl); 
  }

  addToCart(userId: number, cartItem: CartItemDTO): Observable<{ message: string }> {
  return this.http.post<{ message: string }>(`${this.cartUrl}/add?userId=${userId}`, cartItem);
  }

  removeFromCart(cartItemId: number): Observable<string> {
  return this.http.delete(`${this.cartUrl}/remove/${cartItemId}`, { responseType: 'text'});
  }

  addBook(book: any): Observable<any> {
  return this.http.post(`${this.bookUrl}/add`, book);
  }

  deleteBook(bookId: number): Observable<any> {
  return this.http.delete(`${this.bookUrl}/delete/${bookId}`);
  }

  clearUserCart(userId: number): Observable<String>{
    return this.http.delete(`http://localhost:8080/api/cart/clear/${userId}`, {responseType: 'text'});
  }
}

                                                              