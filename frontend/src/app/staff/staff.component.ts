import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Staff } from '../api.service';
import { ColDef, GridOptions } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { ColumnAutoSizeModule } from 'ag-grid-community';

ModuleRegistry.registerModules([ClientSideRowModelModule, ColumnAutoSizeModule]);

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, AgGridModule],
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {
  staff: Staff[] = [];
  columnDefs: ColDef[] = [
    { headerName: 'Staff ID', field: 'staff_id' },
    { headerName: 'Hotel ID', field: 'hotel_id' },
    { headerName: 'Name', field: 'name' },
    { headerName: 'Position', field: 'position' },
    { headerName: 'Contact Info', field: 'contact_info' },
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
    this.apiService.getStaff().subscribe({
      next: (data) => {
        this.staff = data;
      },
      error: (error) => console.error('Error fetching staff:', error),
    });
  }
}
