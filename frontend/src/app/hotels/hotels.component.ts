import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Hotel } from '../api.service';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent implements OnInit {
  hotels: Hotel[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getHotels().subscribe({
      next: (data) => {
        this.hotels = data;
      },
      error: (error) => {
        console.error('Error fetching hotels:', error);
      },
    });
  }
}
