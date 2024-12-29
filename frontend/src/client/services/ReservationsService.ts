/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Reservation } from '../models/Reservation';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReservationsService {
    /**
     * Create a new reservation
     * @param requestBody
     * @returns any Reservation created successfully
     * @throws ApiError
     */
    public static postApiReservation(
        requestBody: Reservation,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/reservation',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Cancel a booking
     * @param id
     * @returns any Booking cancelled successfully
     * @throws ApiError
     */
    public static putApiCancelBooking(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/cancelBooking/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update booking car parking space
     * @param id
     * @param requestBody
     * @returns any Car parking space updated successfully
     * @throws ApiError
     */
    public static putApiUpdateCarParkingSpace(
        id: number,
        requestBody: {
            car_parking_space: 'N' | 'Y';
        },
    ): CancelablePromise<{
        success?: boolean;
        car_parking_space?: string;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/updateCarParkingSpace/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Update booking meal plan
     * @param id
     * @param requestBody
     * @returns any Meal plan updated successfully
     * @throws ApiError
     */
    public static putApiUpdateMealPlan(
        id: number,
        requestBody: {
            meal_plan: 'Meal Plan 1' | 'Meal Plan 2' | 'Not Selected';
        },
    ): CancelablePromise<{
        success?: boolean;
        meal_plan?: string;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/updateMealPlan/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
