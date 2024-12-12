import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Booking } from '../api.service';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  bookings: Booking[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getBookings().subscribe({
      next: (data) => {
        this.bookings = data;
      },
      error: (error) => console.error('Error fetching bookings:', error),
    });
  }
}
