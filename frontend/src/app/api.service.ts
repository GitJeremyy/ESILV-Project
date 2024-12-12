import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getHotels(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/hotels`);
  }

  getBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/bookings`);
  }

  getStaff(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/staff`);
  }
}
