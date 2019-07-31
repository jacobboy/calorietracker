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
/**
 * individual item in a response to a search
 * @export
 * @interface SearchItem
 */
export interface SearchItem {
    /**
     * the food’s NDB Number
     * @type {string}
     * @memberof SearchItem
     */
    ndbno: string;
    /**
     * the food’s name
     * @type {string}
     * @memberof SearchItem
     */
    name: string;
    /**
     * beginning offset into the results list for the items in the list requested
     * @type {number}
     * @memberof SearchItem
     */
    offset: number;
    /**
     * food group to which the food belongs
     * @type {string}
     * @memberof SearchItem
     */
    group: string;
    /**
     * Data source: BL=Branded Food Products or SR=Standard Release 
     * @type {string}
     * @memberof SearchItem
     */
    ds: string;
    /**
     * The foods manufacturer
     * @type {string}
     * @memberof SearchItem
     */
    manu: string;
}

export function SearchItemFromJSON(json: any): SearchItem {
    return {
        'ndbno': json['ndbno'],
        'name': json['name'],
        'offset': json['offset'],
        'group': json['group'],
        'ds': json['ds'],
        'manu': json['manu'],
    };
}

export function SearchItemToJSON(value?: SearchItem): any {
    if (value === undefined) {
        return undefined;
    }
    return {
        'ndbno': value.ndbno,
        'name': value.name,
        'offset': value.offset,
        'group': value.group,
        'ds': value.ds,
        'manu': value.manu,
    };
}

