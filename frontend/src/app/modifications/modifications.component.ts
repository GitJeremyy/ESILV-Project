import { Component, OnInit } from '@angular/core';
import { ApiService, Booking } from '../api.service';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modifications',
  templateUrl: './modifications.component.html',
  standalone: true,
  imports: [DatePipe, FormsModule, NgIf, NgForOf],
  styleUrls: ['./modifications.component.css']
})
export class ModificationsComponent implements OnInit {
  bookings: Booking[] = [];
  selectedBooking: any;
  confirmCancellation: boolean = false;
  showMealPlanSelect: boolean = false;
  showParkingDialog: boolean = false;
  selectedMealPlan: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
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
        alert('Réservation annulée');
        this.getBookings();  // Rafraîchir la liste des réservations
        this.selectedBooking = null;  // Réinitialiser la réservation sélectionnée
        this.confirmCancellation = false;
      },
      error: (error) => {
        console.error('Erreur lors de l\'annulation de la réservation', error);
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
      alert('Plan de repas mis à jour');
      this.getBookings();  // Refresh the list of bookings
      this.selectedBooking = null;  // Reset the selected booking
      this.showMealPlanSelect = false;
    });
  }

  updateCarParkingSpace() {
    this.showParkingDialog = true;
  }

  confirmParking(reserve: boolean) {
    const carParkingSpace = reserve ? 'Y' : 'N';
    this.apiService.updateCarParkingSpace(this.selectedBooking.booking_id, carParkingSpace).subscribe(() => {
      alert('Espace de parking mis à jour');
      this.getBookings();  // Refresh the list of bookings
      this.selectedBooking = null;  // Reset the selected booking
      this.showParkingDialog = false;
    });
  }
}
