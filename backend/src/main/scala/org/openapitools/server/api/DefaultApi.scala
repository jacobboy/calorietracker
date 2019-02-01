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

package org.openapitools.server.api

import org.openapitools.server.model._

import java.io.File

import org.scalatra.ScalatraServlet
import org.scalatra.swagger._
import org.scalatra.json.{ JValueResult, JacksonJsonSupport }
import org.json4s._
import org.json4s.JsonDSL._
import org.json4s.ext.JavaTypesSerializers
import org.json4s.jackson.Serialization

import scala.collection.JavaConverters._

import com.macromacro.storage._

class DefaultApi(implicit val swagger: Swagger) extends ScalatraServlet
  with JacksonJsonSupport
  with SwaggerSupport {

  // protected implicit val jsonFormats: Formats = DefaultFormats
  protected implicit val jsonFormats: Formats = Serialization.formats(NoTypeHints) ++ JavaTypesSerializers.all

  protected val applicationDescription: String = "MacroMacroApi"

  before() {
    contentType = formats("json")
    response.headers += ("Access-Control-Allow-Origin" -> "*")
  }

  val createIngredientOperation = (apiOperation[NamedMacros]("createIngredient")
    summary ""
    parameters (bodyParam[NewIngredient]("newIngredient").description("")))

  post("/ingredients", operation(createIngredientOperation)) {
    val newIngredient = parsedBody.extract[NewIngredient]
    Storage.save(newIngredient)
  }

  val createRecipeOperation = (apiOperation[NamedMacros]("createRecipe")
    summary ""
    parameters (bodyParam[NewRecipe]("newRecipe").description("")))

  post("/recipes", operation(createRecipeOperation)) {
    val newRecipe = parsedBody.extract[NewRecipe]
    Storage.save(newRecipe)
  }

  val findIngredientByUIDOperation = (apiOperation[NamedMacros]("findIngredientByUID")
    summary ""
    parameters (pathParam[String]("uid").description("")))

  get("/ingredients/:uid", operation(findIngredientByUIDOperation)) {
    val uid = params.getOrElse("uid", halt(400))
    Storage.getIngredient(uid)
  }

  val findIngredientsOperation = (apiOperation[List[NamedMacros]]("findIngredients")
    summary ""
    parameters (queryParam[String]("sort").description("").optional, queryParam[Int]("limit").description("").optional))

  get("/ingredients", operation(findIngredientsOperation)) {
    val sort = params.getAs[String]("sort")

    val limit = params.getAs[Int]("limit")

    //println("limit: " + limit)
  }

  val findRecipeByUIDOperation = (apiOperation[Recipe]("findRecipeByUID")
    summary ""
    parameters (pathParam[String]("uid").description(""), queryParam[String]("format").description("").optional))

  get("/recipes/:uid", operation(findRecipeByUIDOperation)) {
    val uid = params.getOrElse("uid", halt(400))
    Storage.getRecipe(uid)
  }

  val findRecipesOperation = (apiOperation[List[NamedMacros]]("findRecipes")
    summary ""
    parameters (queryParam[String]("sort").description("").optional, queryParam[Int]("limit").description("").optional))

  get("/recipes", operation(findRecipesOperation)) {
    val sort = params.getAs[String]("sort")

    //println("sort: " + sort)
    val limit = params.getAs[Int]("limit")

    //println("limit: " + limit)
  }

  val searchByNameOperation = (apiOperation[List[NamedMacros]]("searchAll")
    summary ""
    parameters (
      queryParam[String]("q").description(""),
      queryParam[String]("sort").description("").optional,
      queryParam[Int]("limit").description("").optional))

  get("/search", operation(searchByNameOperation)) {
    val q = params.getOrElse("q", halt(400))
    val sort = params.getAs[String]("sort")
    val limit = params.getAs[Int]("limit")
    Storage.getIngredientsAndRecipes(q)
  }

  // TODO remove this
  val deleteByUidOperation = (apiOperation[String]("deleteItem")
    summary ""
    parameters (
      pathParam[String]("uid").description("")))

  delete("/items/:uid", operation(deleteByUidOperation)) {
    val uid = params.getOrElse("uid", halt(400))
    Storage.deleteItem(uid)
  }

}
