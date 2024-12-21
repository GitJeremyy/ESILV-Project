import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Guest } from '../api.service';
import {ColDef, GridOptions} from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { ColumnAutoSizeModule } from 'ag-grid-community';

ModuleRegistry.registerModules([ClientSideRowModelModule, ColumnAutoSizeModule]);

@Component({
  selector: 'app-guests',
  standalone: true,
  imports: [CommonModule, AgGridModule],
  templateUrl: './guests.component.html',
  styleUrls: ['./guests.component.css']
})
export class GuestsComponent implements OnInit {
  guests: Guest[] = [];

  columnDefs: ColDef[] = [
    { headerName: 'Guest ID', field: 'guest_id'},
    { headerName: 'Name', field: 'g_name'},
    { headerName: 'Email', field: 'g_email'},
    { headerName: 'Phone', field: 'g_phone'},
    { headerName: 'Repeated Guest', field: 'repeated_guest'},
    { headerName: 'Previous Cancellations', field: 'previous_cancellations'},
    { headerName: 'Previous Bookings Not Canceled', field: 'previous_bookings_not_canceled'}
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
    this.apiService.getGuests().subscribe({
      next: (data) => {
        this.guests = data;
      },
      error: (error) => console.error('Error fetching guests:', error),
    });
  }
}
