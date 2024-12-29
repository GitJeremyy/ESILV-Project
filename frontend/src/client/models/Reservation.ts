/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Reservation = {
    no_of_adults: number;
    no_of_children?: number;
    meal_plan: Reservation.meal_plan;
    car_parking_space?: Reservation.car_parking_space;
    booking_date: string;
    no_of_nights: number;
    room_type: Reservation.room_type;
};
export namespace Reservation {
    export enum meal_plan {
        MEAL_PLAN_1 = 'Meal Plan 1',
        MEAL_PLAN_2 = 'Meal Plan 2',
        NOT_SELECTED = 'Not Selected',
    }
    export enum car_parking_space {
        N = 'N',
        Y = 'Y',
    }
    export enum room_type {
        SINGLE = 'Single',
        DOUBLE = 'Double',
        SUITE = 'Suite',
        FAMILY = 'Family',
        LUXURIOUS = 'Luxurious',
        PENTHOUSE = 'Penthouse',
    }
}

