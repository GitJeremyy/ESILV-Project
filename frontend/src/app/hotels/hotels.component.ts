import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Hotel } from '../api.service';  // Ensure ApiService and Hotel interface are properly defined

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hotels.component.html',  // Reference the HTML template
})
export class HotelsComponent implements OnInit {
  hotels: Hotel[] = [];  // Declare an empty array to store hotel data

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getHotels().subscribe({
      next: (data) => {
        console.log('Data from API:', data);  // Log the response for debugging
        this.hotels = data;  // Assign the data to the hotels array
      },
      error: (error) => {
        console.error('Error fetching hotels:', error);  // Handle any errors
      },
    });
  }
}
