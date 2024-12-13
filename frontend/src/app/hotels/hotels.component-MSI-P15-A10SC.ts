import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Hotels</h2>
    <ul>
      <li *ngFor="let hotel of hotels">{{ hotel.nameH }} - {{ hotel.location }}</li>
    </ul>
  `,
})
export class HotelsComponent {
  hotels: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getHotels().subscribe(
      (data) => (this.hotels = data),
      (error) => console.error('Error fetching hotels:', error)
    );
  }
}
