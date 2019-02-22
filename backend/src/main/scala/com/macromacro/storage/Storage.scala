package com.macromacro.storage

import collection.JavaConverters._
import com.google.appengine.api.search._
import com.google.appengine.api.search.Index
import com.google.appengine.api.search.IndexSpec
import com.google.appengine.api.search.Facet
import com.google.appengine.api.search.Field
import com.google.appengine.api.search.PutException
import com.google.appengine.api.search.SearchServiceFactory
import com.google.appengine.api.search.StatusCode
import com.macromacro.schema._
import com.macromacro.usda.{ FoodFood, ReportNotFound, USDAError, UsdaApiError, UsdaClient }
import java.util.Date
import org.openapitools.server.model._
import org.json4s._
import org.json4s.ext.JavaTypesSerializers
import org.json4s.jackson.Serialization
import org.json4s.jackson.Serialization.{ read, write }
import scala.util.{ Try, Success, Failure }

protected object IngredientIndex {
  /** Wrapper around the SearchIndex to return Option instead of a possibly null value from get */
  protected val ingredientIndexName = "ingredients"

  private def ingredientIndex = {
    val indexSpec = IndexSpec.newBuilder().setName(ingredientIndexName).build()
    SearchServiceFactory.getSearchService().getIndex(indexSpec)
  }

  protected def retryIfTransientError[T](f: () => T): Either[StorageError, T] = {
    // val x = Try(f).recoverWith({
    //   case e: SearchBaseException if StatusCode.TRANSIENT_ERROR.equals(e.getOperationResult().getCode()) => {
    //     Try(f)
    //   }
    // }).

    // match {
    //   case Success(v) => Right(v)
    //   case Failure(e) => Left(ConnectionError("Shit"))
    // }

    // Either.catch[SearchBaseException](f).left.map(
    //   e => ConnectionError("shit")
    // )

    try {
      Right(f())
    } catch {
      case e: SearchBaseException => {
        if (StatusCode.TRANSIENT_ERROR.equals(e.getOperationResult().getCode())) {
          try {
            Right(f())
          } catch {
            case e: SearchBaseException => {
              Left(ConnectionError("shit"))
            }
          }
        } else {
          Left(ConnectionError("shit"))
        }
      }
    }
  }

  def find(uid: String): Either[StorageError, Document] = {
    retryIfTransientError(
      () => Option(ingredientIndex.get(uid)).toRight(MissingIngredientError(uid))).joinRight
  }

  def put(doc: Document): Option[StorageError] = {
    retryIfTransientError(() => ingredientIndex.put(doc)) match {
      case Left(e) => Some(e)
      case _ => None
    }
  }

  def search(query: Query): Either[StorageError, Results[ScoredDocument]] = {
    retryIfTransientError(() => ingredientIndex.search(query))
  }

  def delete(uid: String) = {
    ingredientIndex.delete(uid)
  }
}

object Storage {

  private implicit val jsonFormats = Serialization.formats(NoTypeHints) ++ JavaTypesSerializers.all
  private val typeFacet = "type"

  protected case class StoredRecipe(
    uid: String,
    name: String,
    fat: BigDecimal,
    carbs: BigDecimal,
    protein: BigDecimal,
    calories: BigDecimal,
    unit: String,
    foods: List[AmountOfIngredient],
    totalSize: BigDecimal,
    portionSize: BigDecimal) {

    def toNamedMacros() = {
      NamedMacros(uid, name, fat, carbs, protein, calories, portionSize, unit)
    }
  }

  private def document(id: String, t: String, keyValues: (String, String)*) = {
    val doc = Document.newBuilder
      .setId(id)
      .addFacet(Facet.withAtom(typeFacet, t))
      // Adding field bc it doesn't seem possible to get facets from Document
      .addField(Field.newBuilder.setName(typeFacet).setAtom(t))
      .addField(Field.newBuilder.setName("created").setDate(new Date()))
    keyValues.map { case (k, v) => Field.newBuilder.setName(k).setText(v) }
      .map(doc.addField(_))
    doc.build
  }

  private def nameBodyDoc(id: String, t: String, name: String, body: String) = {
    document(id, t, ("name", name), ("body", body))
  }

  private def readToNamedMacros(doc: Document): NamedMacros = {
    val t = doc.getOnlyField(typeFacet).getAtom
    val body = doc.getOnlyField("body").getText

    t match {
      case "ingredient" => read[NamedMacros](body)
      case "recipe" => read[StoredRecipe](body).toNamedMacros
    }
  }

  protected def saveAndGetUsdaIngredient(uid: String): Either[StorageError, NamedMacros] = {
    UsdaClient.foodReport(uid).left.map {
      case ReportNotFound(ndbno) => MissingIngredientError(uid)
      // TODO improve this error handling
      case UsdaApiError(code, errorMessage) => ConnectionError(errorMessage)
    }.map(_.toCompleteFood).flatMap(_.toRight(MissingIngredientError(uid)))
      .map(save(_)).map(_.toNamedMacros)
  }

  protected def getIngredientOrSaveAndGetUsdaIngredient(
    uid: String): Either[StorageError, NamedMacros] = {

    def getNamedMacros(uid: String) = IngredientIndex.find(uid).map(readToNamedMacros(_))

    uid match {
      case IngredientId() => getNamedMacros(uid)
      case RecipeId() => getNamedMacros(uid)
      case UsdaId(ndbno) => {
        getNamedMacros(uid).left.map(
          e => saveAndGetUsdaIngredient(uid)).joinLeft
      }
      case _ => Left(MissingIngredientError(uid))
    }
  }

  protected def amountsToMacros(
    foods: List[AmountOfIngredient]): Either[List[StorageError], List[AmountOfNamedMacros]] = {
    val possiblyMacros = foods.map(
      amt => getIngredientOrSaveAndGetUsdaIngredient(amt.uid).map(AmountOfNamedMacros(amt.amount, _)))

    possiblyMacros.partition(_.isLeft) match {
      case (Nil, macros) => Right(for (Right(i) <- macros.view) yield i)
      case (errors, _) => Left(for (Left(s) <- errors.view) yield s)
    }
  }

  protected def calculateStoredRecipe(
    uid: String, name: String, foods: List[AmountOfIngredient], totalSize: BigDecimal,
    portionSize: BigDecimal, unit: String): Either[List[StorageError], StoredRecipe] = {
    val multiplier = portionSize / totalSize
    amountsToMacros(foods).map(ingredients => {
      val fat = ingredients.map(_.fat).sum * multiplier
      val carbs = ingredients.map(_.carbs).sum * multiplier
      val protein = ingredients.map(_.protein).sum * multiplier
      val calories = ingredients.map(_.calories).sum * multiplier
      StoredRecipe(uid, name, fat, carbs, protein, calories, unit, foods, totalSize, portionSize)
    })
  }

  def save(newIngredient: NewIngredient): NamedMacros = {
    val ingredient = NamedMacros(
      IngredientId(),
      newIngredient.name,
      newIngredient.fat,
      newIngredient.carbs,
      newIngredient.protein,
      newIngredient.calories,
      newIngredient.amount,
      newIngredient.unit)
    IngredientIndex.put(nameBodyDoc(ingredient.uid, "ingredient", ingredient.name, write(ingredient)))
    ingredient
  }

  def save(newRecipe: NewRecipe): Either[List[StorageError], NamedMacros] = {
    calculateStoredRecipe(
      RecipeId(), newRecipe.name, newRecipe.foods, newRecipe.totalSize,
      newRecipe.portionSize, newRecipe.unit).map(r => {
        val recipeJson = write(r)
        val document = nameBodyDoc(r.uid, "recipe", r.name, recipeJson)
        IngredientIndex.put(document);
        NamedMacros(
          r.uid, r.name, r.fat, r.carbs, r.protein,
          r.calories, r.portionSize, r.unit)
      })
  }

  def save(food: CompleteFood): CompleteFood = {
    val foodJson = write(food)
    val document = nameBodyDoc(food.uid, "usda", food.name, foodJson)
    IngredientIndex.put(document);
    food
  }

  def getIngredient(uid: String): Either[StorageError, NamedMacros] = {
    getIngredientOrSaveAndGetUsdaIngredient(uid)
  }

  def getRecipe(uid: String): Either[MissingIngredientError, Recipe] = {

    IngredientIndex.find(uid).map(doc => {
      val recipeJson = doc.getOnlyField("body").getText
      val recipe = read[StoredRecipe](recipeJson)
      val foods = recipe.foods
        .map(
          f => {
            val macrosDoc = IngredientIndex.find(f.uid).getOrElse(throw new Exception("Oh damn"))
            val macros = readToNamedMacros(macrosDoc)
            AmountOfNamedMacros(f.amount, macros)
          })
      Recipe(recipe.uid, recipe.name, recipe.fat, recipe.carbs, recipe.protein, recipe.calories,
        recipe.unit, foods, recipe.totalSize, recipe.portionSize)
    })
  }

  def getIngredientsAndRecipes(searchString: String, limit: Int = 10) = {

    val sortOptions =
      SortOptions.newBuilder()
        .addSortExpression(
          SortExpression.newBuilder()
            .setExpression("_rank")
            .setDirection(SortExpression.SortDirection.DESCENDING))
        .setLimit(limit)
        .build();

    // Build the QueryOptions
    val options =
      QueryOptions.newBuilder
        .setLimit(limit)
        .setSortOptions(sortOptions)
        .build();

    val queryString = s"name:($searchString)"

    //  Build the Query and run the search
    val query = Query.newBuilder
      .setOptions(options)
      .build(queryString);
    val results = IngredientIndex.search(query);

    asScalaIterator(results.iterator).map(readToNamedMacros(_)).toList
  }

  def deleteItem(uid: String) = {
    IngredientIndex.delete(uid)
  }
}
