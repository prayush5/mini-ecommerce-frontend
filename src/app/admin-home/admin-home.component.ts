import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-admin-home',
  imports: [ButtonModule, CardModule, CommonModule, RouterModule],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {

  private router = inject(Router);

  public bookImageUrl = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80';
  public medicineImageUrl = '/assets/images/medicine.jpg';
  public heroBannerUrl = '/assets/images/hero-banner.jpg'; 

  username: string = '';

  ngOnInit(){
    this.username = sessionStorage.getItem('username') || '';
  }

  logout() {
    sessionStorage.removeItem('email');
    this.router.navigate(['login']);
  }

  goToCategory(category: string) {
    this.router.navigate([`/admin-home/${category}`]);
  }

  onImageError(event: Event) {
    console.log('Image failed to load:', (event.target as HTMLImageElement).src);
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
  }
}
