package com.example.app

import org.scalatra._

import org.openapitools.server.model.Ingredient
import org.openapitools.server.model.ModelError
import org.openapitools.server.model.NewIngredient
import org.openapitools.server.model.Recipe

import java.io.File

import org.scalatra.ScalatraServlet
import org.scalatra.swagger._
import org.json4s._
import org.json4s.JsonDSL._
import org.scalatra.json.{ JValueResult, JacksonJsonSupport }
import org.json4s.ext.JavaTypesSerializers
import org.json4s.jackson.Serialization
import org.scalatra.servlet.{ FileUploadSupport, MultipartConfig, SizeConstraintExceededException }

import scala.collection.JavaConverters._

import com.macromacro.storage.Storage

class MyScalatraServlet(implicit val swagger: Swagger) extends ScalatraServlet
    // with FileUploadSupport
    with JacksonJsonSupport
    with SwaggerSupport {

  // protected implicit val jsonFormats: Formats = DefaultFormats
  protected implicit val jsonFormats: Formats = Serialization.formats(NoTypeHints) ++ JavaTypesSerializers.all

  protected val applicationDescription: String = "MacroMacroApi"

  before() {
    contentType = formats("json")
    response.headers += ("Access-Control-Allow-Origin" -> "*")
  }

  get("/") {
    "what's up"
  }

  val addIngredientOperation = (apiOperation[Ingredient]("addIngredient")
    summary ""
    parameters (bodyParam[NewIngredient]("newIngredient").description("")))

  post("/ingredients", operation(addIngredientOperation)) {
    val newIngredient = parsedBody.extract[NewIngredient]
    Storage.saveIngredient(newIngredient)
  }

  val addRecipeOperation = (apiOperation[Recipe]("addRecipe")
    summary ""
    parameters (bodyParam[Recipe]("recipe").description("")))

  post("/recipes", operation(addRecipeOperation)) {
    //println("recipe: " + recipe)
  }

  val findIngredientByUIDOperation = (apiOperation[Ingredient]("findIngredientByUID")
    summary ""
    parameters (pathParam[String]("uid").description("")))

  get("/ingredients/:uid", operation(findIngredientByUIDOperation)) {
    val uid = params.getOrElse("uid", halt(400))
    println("getIngredient: " + uid)
    Storage.getIngredient(uid)
  }

  val findIngredientsOperation = (apiOperation[List[Ingredient]]("findIngredients")
    summary ""
    parameters (queryParam[String]("sort").description("").optional, queryParam[Int]("limit").description("").optional))

  get("/ingredients", operation(findIngredientsOperation)) {
    val sort = params.getAs[String]("sort")

    //println("sort: " + sort)
    val limit = params.getAs[Int]("limit")

    //println("limit: " + limit)
  }

  val findRecipeByUIDOperation = (apiOperation[Recipe]("findRecipeByUID")
    summary ""
    parameters (pathParam[String]("uid").description("")))

  get("/recipes/:uid", operation(findRecipeByUIDOperation)) {
    val uid = params.getOrElse("uid", halt(400))
    //println("uid: " + uid)
  }

  val findRecipesOperation = (apiOperation[List[Recipe]]("findRecipes")
    summary ""
    parameters (queryParam[String]("sort").description("").optional, queryParam[Int]("limit").description("").optional))

  get("/recipes", operation(findRecipesOperation)) {
    val sort = params.getAs[String]("sort")

    //println("sort: " + sort)
    val limit = params.getAs[Int]("limit")

    //println("limit: " + limit)
  }
}
