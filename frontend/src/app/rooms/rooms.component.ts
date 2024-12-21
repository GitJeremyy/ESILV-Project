import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Room } from '../api.service';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions, ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { ColumnAutoSizeModule } from 'ag-grid-community';

ModuleRegistry.registerModules([ClientSideRowModelModule, ColumnAutoSizeModule]);

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, AgGridModule],
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];

  columnDefs: ColDef[] = [
    { headerName: 'Room ID', field: 'room_id' },
    { headerName: 'Hotel ID', field: 'hotel_id' },
    { headerName: 'Room Type', field: 'room_type' },
    { headerName: 'Price', field: 'price' }
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
    this.apiService.getRooms().subscribe({
      next: (data) => {
        this.rooms = data;
      },
      error: (error) => console.error('Error fetching rooms:', error),
    });
  }
}
