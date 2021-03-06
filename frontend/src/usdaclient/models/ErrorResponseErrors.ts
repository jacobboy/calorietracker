// tslint:disable
/**
 * USDA Report API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 2
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists } from '../runtime';
import {
    ErrorItem,
    ErrorItemFromJSON,
    ErrorItemToJSON,
} from './';

/**
 * 
 * @export
 * @interface ErrorResponseErrors
 */
export interface ErrorResponseErrors {
    /**
     * 
     * @type {Array<ErrorItem>}
     * @memberof ErrorResponseErrors
     */
    error: Array<ErrorItem>;
}

export function ErrorResponseErrorsFromJSON(json: any): ErrorResponseErrors {
    return {
        'error': (json['error'] as Array<any>).map(ErrorItemFromJSON),
    };
}

export function ErrorResponseErrorsToJSON(value?: ErrorResponseErrors): any {
    if (value === undefined) {
        return undefined;
    }
    return {
        'error': (value.error as Array<any>).map(ErrorItemToJSON),
    };
}


