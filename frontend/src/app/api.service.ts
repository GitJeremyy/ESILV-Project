import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Hotel {
  hotel_id: number;
  nameH: string;
  location: string;
  total_bookings: number;
}

export interface Guest {
  guest_id: number;
  g_name: string;
  g_email: string;
  g_phone: string;
  repeated_guest: 'Y' | 'N';  // 'Y' or 'N'
  previous_cancellations: number;
  previous_bookings_not_canceled: number;
}

export interface Room {
  room_id: number;
  hotel_id: number;
  room_type: string;
  price: number;
}

export interface Booking {
  booking_id: number;
  guest_id: number;
  hotel_id: number;
  room_id: number;
  no_of_adults: number;
  no_of_children: number;
  meal_plan: string;
  car_parking_space: 'Y' | 'N';
  lead_time: number;
  booking_status: string;
  booking_date: string;
  no_of_nights: number;
}

export interface Staff {
  staff_id: number;
  hotel_id: number;
  name: string;
  position: string;
  contact_info: string;
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

  // Fetches guests data from the backend
  getGuests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/guests`);  // API endpoint for guests
  }

  // Fetches rooms data from the backend
  getRooms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/rooms`);  // API endpoint for rooms
  }

  // Creates a new booking
  createBooking(reservationData:any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reservation`, reservationData);  // API endpoint for creating a booking
  }

  // Cancel a booking
  cancelBooking(bookingId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/cancelBooking/${bookingId}`, {});
  }

  // Update meal plan
  updateMealPlan(bookingId: number, mealPlan: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateMealPlan/${bookingId}`, { meal_plan: mealPlan });
  }

  // Update car parking space
  updateCarParkingSpace(bookingId: number, carParkingSpace: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateCarParkingSpace/${bookingId}`, { car_parking_space: carParkingSpace });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { username, password });
  }

}
