import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-success',
  imports: [ButtonModule],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent {

  constructor(private router: Router){}

  goToHome() {
    this.router.navigate(['/home'])
  }

  private authService = inject(AuthService);

//  ngOnInit() {
//   const url = new URL(window.location.href);
//   if (url.searchParams.has('session_id')) {
//     window.history.replaceState({}, '', '/success');
//   }

//   const storedUserId = localStorage.getItem('userId');
//   if (storedUserId) {
//     this.authService.clearUserCart(+storedUserId).subscribe({
//       next: res => {
//         console.log('✅ Cart cleared:', res);
//         this.authService.clearLocalCart();
//         this.goToHome();
//       },
//       error: err => {
//         console.error('❌ Failed to clear cart:', err);
//         this.goToHome();
//       }
//     });
//   } else {
//     this.goToHome();
//   }
// }

}
