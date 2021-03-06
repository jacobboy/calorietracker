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


import * as runtime from '../runtime';
import {
    ErrorResponse,
    ErrorResponseFromJSON,
    ErrorResponseToJSON,
    FoodReport,
    FoodReportFromJSON,
    FoodReportToJSON,
    SearchResponse,
    SearchResponseFromJSON,
    SearchResponseToJSON,
} from '../models';

export interface ReportsRequest {
    apiKey: string;
    ndbno: Array<string>;
    type?: ReportsTypeEnum;
    format?: ReportsFormatEnum;
}

export interface SearchRequest {
    apiKey: string;
    q: string;
    ds?: SearchDsEnum;
    fg?: string;
    sort?: SearchSortEnum;
    max?: number;
    offset?: number;
    format?: SearchFormatEnum;
}

/**
 * no description
 */
export class DefaultApi extends runtime.BaseAPI {

    /**
     * Get a food report
     */
    async reportsRaw(requestParameters: ReportsRequest): Promise<runtime.ApiResponse<FoodReport>> {
        if (requestParameters.apiKey === null || requestParameters.apiKey === undefined) {
            throw new runtime.RequiredError('apiKey','Required parameter requestParameters.apiKey was null or undefined when calling reports.');
        }

        if (requestParameters.ndbno === null || requestParameters.ndbno === undefined) {
            throw new runtime.RequiredError('ndbno','Required parameter requestParameters.ndbno was null or undefined when calling reports.');
        }

        const queryParameters: runtime.HTTPQuery = {};

        if (requestParameters.apiKey !== undefined) {
            queryParameters['api_key'] = requestParameters.apiKey;
        }

        if (requestParameters.ndbno) {
            queryParameters['ndbno'] = requestParameters.ndbno;
        }

        if (requestParameters.type !== undefined) {
            queryParameters['type'] = requestParameters.type;
        }

        if (requestParameters.format !== undefined) {
            queryParameters['format'] = requestParameters.format;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/V2/reports`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => FoodReportFromJSON(jsonValue));
    }

    /**
     * Get a food report
     */
    async reports(requestParameters: ReportsRequest): Promise<FoodReport> {
        const response = await this.reportsRaw(requestParameters);
        return await response.value();
    }

    /**
     * A search request sends keyword queries and returns lists of foods which contain one or more of the keywords in the food description, scientific name, or commerical name fields. Search requests are a good way to locate NDB numbers (NDBno) for the reports API as well as for general discovery.
     */
    async searchRaw(requestParameters: SearchRequest): Promise<runtime.ApiResponse<SearchResponse>> {
        if (requestParameters.apiKey === null || requestParameters.apiKey === undefined) {
            throw new runtime.RequiredError('apiKey','Required parameter requestParameters.apiKey was null or undefined when calling search.');
        }

        if (requestParameters.q === null || requestParameters.q === undefined) {
            throw new runtime.RequiredError('q','Required parameter requestParameters.q was null or undefined when calling search.');
        }

        const queryParameters: runtime.HTTPQuery = {};

        if (requestParameters.apiKey !== undefined) {
            queryParameters['api_key'] = requestParameters.apiKey;
        }

        if (requestParameters.q !== undefined) {
            queryParameters['q'] = requestParameters.q;
        }

        if (requestParameters.ds !== undefined) {
            queryParameters['ds'] = requestParameters.ds;
        }

        if (requestParameters.fg !== undefined) {
            queryParameters['fg'] = requestParameters.fg;
        }

        if (requestParameters.sort !== undefined) {
            queryParameters['sort'] = requestParameters.sort;
        }

        if (requestParameters.max !== undefined) {
            queryParameters['max'] = requestParameters.max;
        }

        if (requestParameters.offset !== undefined) {
            queryParameters['offset'] = requestParameters.offset;
        }

        if (requestParameters.format !== undefined) {
            queryParameters['format'] = requestParameters.format;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/search`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => SearchResponseFromJSON(jsonValue));
    }

    /**
     * A search request sends keyword queries and returns lists of foods which contain one or more of the keywords in the food description, scientific name, or commerical name fields. Search requests are a good way to locate NDB numbers (NDBno) for the reports API as well as for general discovery.
     */
    async search(requestParameters: SearchRequest): Promise<SearchResponse> {
        const response = await this.searchRaw(requestParameters);
        return await response.value();
    }

}

/**
    * @export
    * @enum {string}
    */
export enum ReportsTypeEnum {
    B = 'b',
    F = 'f',
    S = 's'
}
/**
    * @export
    * @enum {string}
    */
export enum ReportsFormatEnum {
    Xml = 'xml',
    Json = 'json'
}
/**
    * @export
    * @enum {string}
    */
export enum SearchDsEnum {
    BrandedFoodProducts = 'Branded Food Products',
    StandardReference = 'Standard Reference'
}
/**
    * @export
    * @enum {string}
    */
export enum SearchSortEnum {
    N = 'n',
    R = 'r'
}
/**
    * @export
    * @enum {string}
    */
export enum SearchFormatEnum {
    Json = 'json',
    Xml = 'xml'
}
