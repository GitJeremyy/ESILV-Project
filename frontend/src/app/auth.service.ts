import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isTokenPresent());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {}

  isTokenPresent(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      const tokenPresent = !!localStorage.getItem('token');
      console.log('Token present:', tokenPresent); // Debug
      return tokenPresent;
    }
    return false;
  }

  login(token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('token', token);
      this.isAuthenticatedSubject.next(true);
    }
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
      this.isAuthenticatedSubject.next(false);
    }
  }
}
