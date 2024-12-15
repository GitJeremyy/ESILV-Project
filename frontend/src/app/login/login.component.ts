import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../auth.service'; // Ajout du service AuthService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService // Injecter AuthService
  ) {}

  login() {
    this.apiService.login(this.username, this.password).subscribe({
      next: (response) => {
        // Save token in localStorage
        localStorage.setItem('token', response.token);

        // update authentification state in service
        this.authService.login(response.token);

        // Redirect towards menu
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'An error occurred';
      },
    });
  }
}
