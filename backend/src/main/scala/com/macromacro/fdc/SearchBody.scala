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

case class SearchBody (
  /* Search query (general text). */
  generalSearchInput: Option[String] = None,
  includeDataTypes: Option[SearchBodyIncludeDataTypes] = None,
  /* The list of ingredients (as it appears on the product label). */
  ingredients: Option[String] = None,
  /* Brand owner for the food. */
  brandOwner: Option[String] = None,
  /* When true, the search will only return foods that contain all of the words that were entered in the search field.  */
  requireAllWords: Option[SearchBodyEnums.RequireAllWords] = None,
  /* The page of results to return. */
  pageNumber: Option[String] = None,
  /* The name of the field by which to sort. Possible sorting options: lowercaseDescription.keyword, dataType.keyword, publishedDate, fdcId.  */
  sortField: Option[SearchBodyEnums.SortField] = None,
  /* The direction of the sorting, either \"asc\" or \"desc\". */
  sortDirection: Option[SearchBodyEnums.SortDirection] = None
)

object SearchBodyEnums {

  type RequireAllWords = RequireAllWords.Value
  type SortField = SortField.Value
  type SortDirection = SortDirection.Value
  object RequireAllWords extends Enumeration {
    val `True` = Value("true")
    val `False` = Value("false")
  }

  object SortField extends Enumeration {
    val LowercaseDescriptionKeyword = Value("lowercaseDescription.keyword")
    val DataTypeKeyword = Value("dataType.keyword")
    val PublishedDate = Value("publishedDate")
    val FdcId = Value("fdcId")
  }

  object SortDirection extends Enumeration {
    val Asc = Value("asc")
    val Desc = Value("desc")
  }

}