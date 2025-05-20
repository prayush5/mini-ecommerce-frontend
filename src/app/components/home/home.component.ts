import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, CardModule, CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private router = inject(Router);

  public bookImageUrl = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80';
  public medicineImageUrl = '/assets/images/medicine.jpg';
  public heroBannerUrl = '/assets/images/hero-banner.jpg'; 

  logout() {
    sessionStorage.removeItem('email');
    this.router.navigate(['login']);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToCategory(category: string) {
    this.router.navigate([`/shop/${category}`]);
  }

  onImageError(event: Event) {
    console.log('Image failed to load:', (event.target as HTMLImageElement).src);
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
  }
}