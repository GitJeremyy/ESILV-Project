import { Component, OnInit } from '@angular/core';
import {Router, NavigationEnd, RouterOutlet, RouterLink} from '@angular/router';
import { AuthService } from './auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    RouterOutlet,
    NgIf,
    RouterLink
  ]
})
export class AppComponent implements OnInit {
  title = 'Hotel Management System';
  isAuthenticated: boolean = false;
  isLoginPage: boolean = false; // Ajout de cette propriété

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Mettez à jour l'état d'authentification
    this.authService.isAuthenticated$.subscribe((authState) => {
      this.isAuthenticated = authState;
    });

    // Écoutez les changements de route pour déterminer si on est sur la page de login
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = event.url === '/login';
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
