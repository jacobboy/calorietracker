/**
 * Macro Macro API
 * An API that provides access to recipe and ingredient information, both user-generated and sourced from the USDA
 *
 * OpenAPI spec version: 1.0.0
 * Contact: team@openapitools.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 */

package org.openapitools.server.model

case class Recipe(
  uid: String,

  name: String,

  fat: BigDecimal,

  carbs: BigDecimal,

  protein: BigDecimal,

  calories: BigDecimal,

  unit: String,

  foods: List[NamedMacros],

  totalSize: BigDecimal,

  portionSize: BigDecimal) {

}