/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Hotel } from '../models/Hotel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HotelsService {
    /**
     * Get all hotels
     * @returns Hotel List of hotels
     * @throws ApiError
     */
    public static getApiHotels(): CancelablePromise<Array<Hotel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/hotels',
        });
    }
}
