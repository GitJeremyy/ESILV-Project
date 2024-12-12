import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Guest } from '../api.service';

@Component({
  selector: 'app-guests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guests.component.html',
  styleUrls: ['./guests.component.css']
})
export class GuestsComponent implements OnInit {
  guests: Guest[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getGuests().subscribe({
      next: (data) => {
        this.guests = data;
      },
      error: (error) => console.error('Error fetching staff:', error),
    });
  }
}
