import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Room } from '../api.service';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getRooms().subscribe({
      next: (data) => {
        this.rooms = data;
      },
      error: (error) => console.error('Error fetching staff:', error),
    });
  }
}
