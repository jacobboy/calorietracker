// tslint:disable
/**
 * Macro Macro API
 * An API that provides access to recipe and ingredient information, both user-generated and sourced from the USDA
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import {
    NamedMacros,
    NamedMacrosFromJSON,
    NamedMacrosFromJSONTyped,
    NamedMacrosToJSON,
} from './';

/**
 * 
 * @export
 * @interface AmountOfNamedMacros
 */
export interface AmountOfNamedMacros {
    /**
     * 
     * @type {NamedMacros}
     * @memberof AmountOfNamedMacros
     */
    namedMacros: NamedMacros;
    /**
     * 
     * @type {number}
     * @memberof AmountOfNamedMacros
     */
    amount: number;
}

export function AmountOfNamedMacrosFromJSON(json: any): AmountOfNamedMacros {
    return AmountOfNamedMacrosFromJSONTyped(json, false);
}

export function AmountOfNamedMacrosFromJSONTyped(json: any, ignoreDiscriminator: boolean): AmountOfNamedMacros {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'namedMacros': NamedMacrosFromJSON(json['namedMacros']),
        'amount': json['amount'],
    };
}

export function AmountOfNamedMacrosToJSON(value?: AmountOfNamedMacros): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'namedMacros': NamedMacrosToJSON(value.namedMacros),
        'amount': value.amount,
    };
}


