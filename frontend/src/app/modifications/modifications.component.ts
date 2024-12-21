import { Component, OnInit } from '@angular/core';
import { ApiService, Booking } from '../api.service';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions, ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { ColumnAutoSizeModule } from 'ag-grid-community';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

ModuleRegistry.registerModules([ClientSideRowModelModule, ColumnAutoSizeModule]);

@Component({
  selector: 'app-modifications',
  templateUrl: './modifications.component.html',
  standalone: true,
  imports: [AgGridModule, NgIf, FormsModule],
  styleUrls: ['./modifications.component.css']
})
export class ModificationsComponent implements OnInit {
  bookings: Booking[] = [];
  selectedBooking: any;
  confirmCancellation: boolean = false;
  showMealPlanSelect: boolean = false;
  showParkingDialog: boolean = false;
  selectedMealPlan: string = '';

  // Variables pour le modal
  showModal: boolean = false;
  modalMessage: string = '';

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
    { headerName: 'Booking Date', field: 'booking_date', valueFormatter: (params: any) => {
        if (params.value) {
          const date = new Date(params.value);
          return date.toLocaleDateString('en-US') || '';
        }
        return '';
      }},
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
    this.getBookings();
  }

  getBookings() {
    this.apiService.getBookings().subscribe({
      next: (data) => {
        this.bookings = data;
      },
      error: (error) => console.error('Error fetching bookings:', error),
    });
  }

  selectBooking(booking: any) {
    this.selectedBooking = booking;
  }

  updateBookingStatus() {
    this.confirmCancellation = true;
  }

  cancelBooking() {
    this.apiService.cancelBooking(this.selectedBooking.booking_id).subscribe({
      next: () => {
        this.showModalMessage('Booking was successfully cancelled!');
        this.getBookings();
        this.selectedBooking = null;
        this.confirmCancellation = false;
      },
      error: (error) => {
        console.error('Error canceling reservation', error);
      }
    });
  }

  closeDialog() {
    this.confirmCancellation = false;
    this.showMealPlanSelect = false;
    this.showParkingDialog = false;
  }

  updateMealPlan() {
    this.showMealPlanSelect = true;
  }

  updateMealPlanConfirmed() {
    this.apiService.updateMealPlan(this.selectedBooking.booking_id, this.selectedMealPlan).subscribe(() => {
      this.showModalMessage('Meal Plan was successfully updated!');
      this.getBookings();
      this.selectedBooking = null;
      this.showMealPlanSelect = false;
    });
  }

  updateCarParkingSpace() {
    this.showParkingDialog = true;
  }

  confirmParking(reserve: boolean) {
    const carParkingSpace = reserve ? 'Y' : 'N';
    this.apiService.updateCarParkingSpace(this.selectedBooking.booking_id, carParkingSpace).subscribe(() => {
      this.showModalMessage('Parking Space was successfully modified!');
      this.getBookings();
      this.selectedBooking = null;
      this.showParkingDialog = false;
    });
  }

  showModalMessage(message: string) {
    this.modalMessage = message;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
