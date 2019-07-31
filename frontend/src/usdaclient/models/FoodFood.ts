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
    Desc,
    DescFromJSON,
    DescToJSON,
    FoodFoodIng,
    FoodFoodIngFromJSON,
    FoodFoodIngToJSON,
    Nutrients,
    NutrientsFromJSON,
    NutrientsToJSON,
} from './';

/**
 * 
 * @export
 * @interface FoodFood
 */
export interface FoodFood {
    /**
     * report type
     * @type {string}
     * @memberof FoodFood
     */
    type: string;
    /**
     * Release version of the data being reported
     * @type {string}
     * @memberof FoodFood
     */
    sr: string;
    /**
     * 
     * @type {Desc}
     * @memberof FoodFood
     */
    desc: Desc;
    /**
     * 
     * @type {FoodFoodIng}
     * @memberof FoodFood
     */
    ing?: FoodFoodIng;
    /**
     * metadata elements for each nutrient included in the food report
     * @type {Array<Nutrients>}
     * @memberof FoodFood
     */
    nutrients: Array<Nutrients>;
}

export function FoodFoodFromJSON(json: any): FoodFood {
    return {
        'type': json['type'],
        'sr': json['sr'],
        'desc': DescFromJSON(json['desc']),
        'ing': !exists(json, 'ing') ? undefined : FoodFoodIngFromJSON(json['ing']),
        'nutrients': (json['nutrients'] as Array<any>).map(NutrientsFromJSON),
    };
}

export function FoodFoodToJSON(value?: FoodFood): any {
    if (value === undefined) {
        return undefined;
    }
    return {
        'type': value.type,
        'sr': value.sr,
        'desc': DescToJSON(value.desc),
        'ing': FoodFoodIngToJSON(value.ing),
        'nutrients': (value.nutrients as Array<any>).map(NutrientsToJSON),
    };
}

