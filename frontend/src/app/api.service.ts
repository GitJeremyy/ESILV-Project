import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Hotel {
  hotel_id: number;
  nameH: string;
  location: string;
  total_bookings: number;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';  // The base URL for your API

  constructor(private http: HttpClient) {}

  // Fetches hotels from the backend
  getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.baseUrl}/hotels`);  // API endpoint for hotels
  }

  // Fetches bookings data from the backend
  getBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/bookings`);  // API endpoint for bookings
  }

  // Fetches staff data from the backend
  getStaff(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/staff`);  // API endpoint for staff
  }
}
