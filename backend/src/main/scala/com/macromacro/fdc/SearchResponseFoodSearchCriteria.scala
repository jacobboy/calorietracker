/**
 * FDC Food Database API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
package macromacro.fdc.model

import org.joda.time.DateTime
import java.util.UUID

case class SearchResponseFoodSearchCriteria (
  foodSearchCriteria: Option[Any] = None,
  totalHits: Option[Int] = None,
  currentPage: Option[Int] = None,
  totalPages: Option[Int] = None,
  foods: Option[Seq[SearchResponseFoodSearchCriteriaFoods]] = None
)
