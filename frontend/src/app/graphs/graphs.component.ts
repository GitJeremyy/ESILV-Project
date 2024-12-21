import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Booking } from '../api.service';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-graphs',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule],
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent implements OnInit, AfterViewInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Number of Reservations per Month (2024)'
    },
    xAxis: {
      categories: []
    },
    yAxis: {
      title: {
        text: 'Number of Reservations'
      }
    },
    series: [{
      type: 'column',
      name: 'Reservations',
      data: []
    }]
  };

  constructor(private apiService: ApiService, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.apiService.getBookings().subscribe({
      next: (data) => {
        this.processBookingsData(data);
      },
      error: (error) => console.error('Error fetching bookings:', error),
    });
  }

  ngAfterViewInit(): void {
    // After view initialization, trigger change detection explicitly
    this.cdRef.detectChanges();
  }

  processBookingsData(bookings: Booking[]) {
    const monthCount = Array(12).fill(0);

    bookings.forEach((booking) => {
      const bookingDate = new Date(booking.booking_date);
      const bookingMonth = bookingDate.getMonth();
      monthCount[bookingMonth]++;
    });

    this.chartOptions = {
      ...this.chartOptions,
      xAxis: {
        categories: [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ]
      },
      series: [{
        type: 'column',
        name: 'Reservations',
        data: monthCount
      }]
    };

    // Trigger change detection
    this.cdRef.detectChanges();
  }
}
