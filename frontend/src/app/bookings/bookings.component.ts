import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Booking } from '../api.service';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions, ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { ColumnAutoSizeModule } from 'ag-grid-community';

ModuleRegistry.registerModules([ClientSideRowModelModule, ColumnAutoSizeModule]);

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, AgGridModule], // Standalone setup
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  bookings: Booking[] = [];

  columnDefs: ColDef[] = [
    { headerName: 'Booking ID', field: 'booking_id' },
    { headerName: 'Guest ID', field: 'guest_id' },
    { headerName: 'Hotel ID', field: 'hotel_id' },
    { headerName: 'Room ID', field: 'room_id' },
    { headerName: 'No. of Adults', field: 'no_of_adults' },
    { headerName: 'No. of Children', field: 'no_of_children' },
    { headerName: 'Meal Plan', field: 'meal_plan' },
    { headerName: 'Car Parking Space', field: 'car_parking_space' },
    { headerName: 'Lead Time', field: 'lead_time' },
    { headerName: 'Booking Status', field: 'booking_status' },
    {
      headerName: 'Booking Date',
      field: 'booking_date',
      valueFormatter: (params: any): string => {
        if (params.value) {
          const date = new Date(params.value);
          return date.toLocaleDateString('en-US') || '';
        }
        return '';
      }
    },
    { headerName: 'No. of Nights', field: 'no_of_nights' }
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  gridOptions: GridOptions;

  constructor(private apiService: ApiService) {
    this.gridOptions = {
      onGridReady: (params) => {
        params.api.sizeColumnsToFit();
      },
    };
  }

  ngOnInit(): void {
    this.apiService.getBookings().subscribe({
      next: (data) => {
        this.bookings = data;
      },
      error: (error) => console.error('Error fetching bookings:', error),
    });
  }
}
