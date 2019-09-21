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
    Macros,
    MacrosFromJSON,
    MacrosFromJSONTyped,
    MacrosToJSON,
} from './';

/**
 * 
 * @export
 * @interface NamedMacros
 */
export interface NamedMacros extends Macros {
    /**
     * 
     * @type {string}
     * @memberof NamedMacros
     */
    uid: string;
    /**
     * 
     * @type {string}
     * @memberof NamedMacros
     */
    name: string;
    /**
     * 
     * @type {number}
     * @memberof NamedMacros
     */
    amount: number;
    /**
     * 
     * @type {string}
     * @memberof NamedMacros
     */
    unit: string;
}

export function NamedMacrosFromJSON(json: any): NamedMacros {
    return NamedMacrosFromJSONTyped(json, false);
}

export function NamedMacrosFromJSONTyped(json: any, ignoreDiscriminator: boolean): NamedMacros {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        ...MacrosFromJSONTyped(json, ignoreDiscriminator),
        'uid': json['uid'],
        'name': json['name'],
        'amount': json['amount'],
        'unit': json['unit'],
    };
}

export function NamedMacrosToJSON(value?: NamedMacros): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        ...MacrosToJSON(value),
        'uid': value.uid,
        'name': value.name,
        'amount': value.amount,
        'unit': value.unit,
    };
}


