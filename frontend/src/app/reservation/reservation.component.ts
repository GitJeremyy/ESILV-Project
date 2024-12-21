import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ApiService } from '../api.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  reservationForm: FormGroup;
  minDate: string;
  showModal: boolean = false;
  modalMessage: string = '';

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    this.reservationForm = this.fb.group({
      no_of_adults: [null, [Validators.required, Validators.min(1)]],
      no_of_children: [null, [Validators.min(0)]],
      meal_plan: ['', Validators.required],
      car_parking_space: ['', [Validators.required, Validators.pattern('^[YN]$')]],
      booking_date: ['', Validators.required],
      no_of_nights: [null, [Validators.required, Validators.min(1)]],
      room_type: ['', Validators.required]
    });

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.reservationForm.valid) {
      this.apiService.createBooking(this.reservationForm.value).subscribe({
        next: (response) => {
          console.log('Booking created successfully:', response);
          this.modalMessage = 'Thank you for your booking! See you soon :)';
          this.showModal = true;
          this.reservationForm.reset();
        },
        error: (error) => {
          console.error('Error creating booking:', error);
          this.modalMessage = 'An error occurred while creating the booking. Please try again.';
          this.showModal = true;
        },
        complete: () => {
          console.log('Booking submission process completed.');
        }
      });
    } else {
      alert('Please fill out the form correctly before submitting.');
    }
  }

  closeModal(): void {
    this.showModal = false;
  }
}
