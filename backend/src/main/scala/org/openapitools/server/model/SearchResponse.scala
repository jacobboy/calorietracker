/**
 * Macro Macro API
 * An API that provides access to recipe and ingredient information, both user-generated and sourced from the USDA
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: team@openapitools.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 */

package org.openapitools.server.model

case class SearchResponse(
  recipes: List[NamedMacros],

  ingredients: List[NamedMacros])
