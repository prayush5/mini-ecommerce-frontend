import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/auth';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  user !: User;

  constructor(private authService: AuthService){}

  ngOnInit(): void {
    const userId= 5;
    this.authService.getUserById(userId).subscribe((data) => {
      this.user=data;
    });
  }
}
