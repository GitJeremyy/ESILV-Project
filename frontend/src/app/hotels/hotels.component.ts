import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Hotel } from '../api.service';
import {ColDef, GridOptions} from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { ColumnAutoSizeModule } from 'ag-grid-community';

ModuleRegistry.registerModules([ClientSideRowModelModule, ColumnAutoSizeModule]);

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule, AgGridModule],
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent implements OnInit {
  hotels: Hotel[] = [];

  columnDefs: ColDef[] = [
    { headerName: 'Hotel ID', field: 'hotel_id'},
    { headerName: 'Hotel Name', field: 'nameH'},
    { headerName: 'Location', field: 'location'},
    { headerName: 'Total Bookings', field: 'total_bookings'}
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
    this.apiService.getHotels().subscribe({
      next: (data) => {
        this.hotels = data;
      },
      error: (error) => console.error('Error fetching hotels:', error),
    });
  }
}
