import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cancel',
  imports: [],
  templateUrl: './cancel.component.html',
  styleUrl: './cancel.component.css'
})
export class CancelComponent {

  constructor(private router: Router){}

  goToHome() {
    this.router.navigate(['/home']);
  }
}
