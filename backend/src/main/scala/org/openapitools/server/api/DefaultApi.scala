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

import com.macromacro.settings.Settings
import com.typesafe.scalalogging.LazyLogging
import org.openapitools.server.model._

import java.io.File
import org.scalatra._
import org.scalatra.swagger._
import org.scalatra.json.{ JValueResult, JacksonJsonSupport }
import org.json4s._
import org.json4s.JsonDSL._
import org.json4s.ext.JavaTypesSerializers
import org.json4s.jackson.Serialization

import scala.collection.JavaConverters._

import com.macromacro.storage._

class DefaultApi(implicit val swagger: Swagger, settings: Settings) extends ScalatraServlet
  with LazyLogging
  with JacksonJsonSupport
  with SwaggerSupport {

  // protected implicit val jsonFormats: Formats = DefaultFormats
  protected implicit val jsonFormats: Formats = Serialization.formats(NoTypeHints) ++ JavaTypesSerializers.all

  protected val applicationDescription: String = "MacroMacroApi"

  protected val storage = new Storage

  before() {
    contentType = formats("json")
  }

  // TODO how to not have to duplicate these handler functions?
  def handleGetStorageError[T](resp: Either[StorageError, T]): Any = {
    resp match {
      case Left(error) => {
        AppError.Storage(error)
      }
      case Right(response) => Ok(response)
    }
  }

  // TODO how to not have to duplicate these handler functions?
  def handlePostStorageError[T](resp: Either[StorageError, T]): Any = {
    resp match {
      case Left(error) => {
        AppError.Storage(error)
      }
      case Right(response) => Created(response)
    }
  }

  val createIngredientOperation = (apiOperation[NamedMacros]("createIngredient")
    summary "Creates a new ingredient.  Duplicates are allowed."
    parameters (bodyParam[NewIngredient]("newIngredient").description("Ingredient to create")))

  post("/ingredients", operation(createIngredientOperation)) {
    logger.info("Creating ingredient")
    val newIngredient = parsedBody.extract[NewIngredient]
    handlePostStorageError(storage.save(newIngredient))
  }

  val createRecipeOperation = (apiOperation[NamedMacros]("createRecipe")
    summary "Creates a new recipe.  Duplicates are allowed."
    parameters (bodyParam[NewRecipe]("newRecipe").description("")))

  post("/recipes", operation(createRecipeOperation)) {
    val newRecipe = parsedBody.extract[NewRecipe]
    storage.save(newRecipe) match {
      case Left(connectionError) => {
        AppError.Storage(connectionError)
      }
      case Right(recipeOrMissing) => recipeOrMissing match {
        case Left(errors) => AppError.Storage(errors.head)
        case Right(recipe) => Created(recipe)
      }
    }
  }

  val findIngredientByUIDOperation = (apiOperation[NamedMacros]("findIngredientByUID")
    summary "Returns the ingredient specified by the UID"
    parameters (pathParam[String]("uid").description("")))

  get("/ingredients/:uid", operation(findIngredientByUIDOperation)) {
    val uid = params.getOrElse("uid", halt(400))
    handleGetStorageError(storage.getIngredient(uid))
  }

  val findIngredientsOperation = (apiOperation[List[NamedMacros]]("findIngredients")
    summary "Returns all ingredients the user has saved"
    parameters (
      queryParam[String]("sort").description("").optional,
      queryParam[Int]("limit").description("").optional))

  get("/ingredients", operation(findIngredientsOperation)) {
    val sort = params.getAs[String]("sort")
    val limit = params.getAs[Int]("limit").getOrElse(10)

    handleGetStorageError(storage.getLatestIngredients(limit))
  }

  val findRecipeByUIDOperation = (apiOperation[Recipe]("findRecipeByUID")
    summary "Returns the recipe specified by the UID"
    parameters (
      pathParam[String]("uid").description(""),
      queryParam[String]("format").description("").optional))

  get("/recipes/:uid", operation(findRecipeByUIDOperation)) {
    val uid = params.getOrElse("uid", halt(400))
    handleGetStorageError(storage.getRecipe(uid))
  }

  val findRecipesOperation = (apiOperation[List[NamedMacros]]("findRecipes")
    summary "Returns all recipes the user has saved"
    parameters (
      queryParam[String]("sort").description("").optional,
      queryParam[Int]("limit").description("").optional))

  get("/recipes", operation(findRecipesOperation)) {
    val sort = params.getAs[String]("sort")
    val limit = params.getAs[Int]("limit").getOrElse(10)

    handleGetStorageError(storage.getLatestRecipes(limit))
  }

  val searchByNameOperation = (apiOperation[List[NamedMacros]]("searchAll")
    summary "Search for ingredients and recipes by name"
    parameters (
      queryParam[String]("q").description("search key"),
      queryParam[String]("sort").description("sort key. options: recent").optional,
      queryParam[Int]("limit").description("maximum number of results to return. default: 10").optional))

  get("/search", operation(searchByNameOperation)) {
    val q = params.getOrElse("q", halt(400))
    val sort = params.getAs[String]("sort")
    val limit = params.getAs[Int]("limit").getOrElse(10)
    handleGetStorageError(storage.getIngredientsAndRecipes(q, limit))
  }

  // TODO remove this
  val deleteByUidOperation = (apiOperation[String]("deleteItem")
    summary ""
    parameters (
      pathParam[String]("uid").description("")))

  delete("/items/:uid", operation(deleteByUidOperation)) {
    val uid = params.getOrElse("uid", halt(400))
    storage.deleteItem(uid)
    NoContent()
  }
}
