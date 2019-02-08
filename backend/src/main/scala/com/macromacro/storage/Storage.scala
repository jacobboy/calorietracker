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
import com.macromacro.usda.FoodFood
import java.util.Date
import java.util.UUID.randomUUID
import org.openapitools.server.model._
import org.json4s._
import org.json4s.ext.JavaTypesSerializers
import org.json4s.jackson.Serialization
import org.json4s.jackson.Serialization.{ read, write }

trait StorageError
case class MissingIngredientError(uid: String) extends StorageError
case class MissingIngredientsError(uids: List[String]) extends StorageError {
  protected def fromMissings(errors: List[MissingIngredientError]) = {
    MissingIngredientsError(errors.map(_.uid))
  }
}

protected object IngredientIndex {
  /** Wrapper around the SearchIndex to return Option instead of a possibly null value from get */
  protected val ingredientIndexName = "ingredients"

  private def ingredientIndex = {
    val indexSpec = IndexSpec.newBuilder().setName(ingredientIndexName).build()
    SearchServiceFactory.getSearchService().getIndex(indexSpec)
  }

  def get(uid: String): Option[Document] = {
    Option(ingredientIndex.get(uid))
  }

  def find(uid: String): Either[MissingIngredientError, Document] = {
    get(uid).toRight(MissingIngredientError(uid))
  }

  def put(doc: Document) = {
    try {
      ingredientIndex.put(doc);
    } catch {
      case e: PutException => {
        if (StatusCode.TRANSIENT_ERROR.equals(e.getOperationResult().getCode())) {
          ingredientIndex.put(doc);
        }
      }
    }
  }

  def search(query: Query) = {
    ingredientIndex.search(query)
  }

  def delete(uid: String) = {
    ingredientIndex.delete(uid)
  }
}

object Storage {

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

  private val ingredientIndexName = "ingredients"
  private implicit val jsonFormats = Serialization.formats(NoTypeHints) ++ JavaTypesSerializers.all

  private def ingredientId = "ingredient::v1::" + randomUUID.toString
  private def recipeId = "recipe::v1::" + randomUUID.toString

  private val typeFacet = "type"

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

  protected def amountsToMacros(
    foods: List[AmountOfIngredient]): Either[MissingIngredientsError, List[Tuple2[BigDecimal, NamedMacros]]] = {
    // TODO here's where we'd need to map calls to the USDA client to get unknown ndbnos
    val foodDocs: List[Tuple2[AmountOfIngredient, Option[Document]]] = {
      foods.map(f => (f, IngredientIndex.get(f.uid)))
    }
    val foundFoodDocs: List[Tuple2[AmountOfIngredient, Document]] = foodDocs.flatMap {
      case (f, Some(doc)) => Some((f, doc))
      case (f, None) => None
    }
    if (foundFoodDocs.length == foodDocs.length) {
      val _foods: List[Tuple2[BigDecimal, NamedMacros]] = foundFoodDocs.map {
        case (f: AmountOfIngredient, doc: Document) => (f.amount, readToNamedMacros(doc))
      }
      Right(_foods)
    } else {
      val missing: List[String] = foodDocs.flatMap {
        case (f, Some(doc)) => None
        case (f, None) => Some(f.uid)
      }
      Left(MissingIngredientsError(missing))
    }
  }

  protected def calculateStoredRecipe(
    uid: String, name: String, foods: List[AmountOfIngredient], totalSize: BigDecimal,
    portionSize: BigDecimal, unit: String): Either[MissingIngredientsError, StoredRecipe] = {
    amountsToMacros(foods).map(ingredients => {
      val multiplier = portionSize / totalSize
      val fat = ingredients.map(f => f._2.fat * f._1 / f._2.amount).sum * multiplier
      val carbs = ingredients.map(f => f._2.carbs * f._1 / f._2.amount).sum * multiplier
      val protein = ingredients.map(f => f._2.protein * f._1 / f._2.amount).sum * multiplier
      val calories = ingredients.map(f => f._2.calories * f._1 / f._2.amount).sum * multiplier
      StoredRecipe(uid, name, fat, carbs, protein, calories, unit, foods, totalSize, portionSize)
    })
  }

  def save(newIngredient: NewIngredient) = {
    val ingredient = NamedMacros(
      ingredientId,
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

  def save(newRecipe: NewRecipe): Either[StorageError, NamedMacros] = {
    calculateStoredRecipe(
      recipeId, newRecipe.name, newRecipe.foods, newRecipe.totalSize,
      newRecipe.portionSize, newRecipe.unit).map(r => {
        val recipeJson = write(r)
        val document = nameBodyDoc(r.uid, "recipe", r.name, recipeJson)
        IngredientIndex.put(document);
        NamedMacros(
          r.uid, r.name, r.fat, r.carbs, r.protein,
          r.calories, r.portionSize, r.unit)
      })
  }

  def save(food: FoodFood): Either[IncompleteUsdaNutrient, NamedMacros] = {
    val namedMacros = food.toNamedMacros
    namedMacros.foreach(
      food => {
        val foodJson = write(food)
        val document = nameBodyDoc(food.uid, "usda", food.name, foodJson)
        IngredientIndex.put(document);
      })
    namedMacros.left.map(_ => IncompleteUsdaNutrient(food.ndbno))
  }

  def getNamedMacros(uid: String): Either[MissingIngredientError, NamedMacros] = {
    IngredientIndex.find(uid).map(readToNamedMacros(_))
  }

  def getRecipe(uid: String): Either[MissingIngredientError, Recipe] = {

    IngredientIndex.find(uid).map(doc => {
      val recipeJson = doc.getOnlyField("body").getText
      val recipe = read[StoredRecipe](recipeJson)
      val foods = recipe.foods
        .map(
          f => {
            val macrosDoc = IngredientIndex.get(f.uid).getOrElse(throw new Exception("Oh damn"))
            val macros = readToNamedMacros(macrosDoc)
            AmountOfNamedMacros(f.amount, macros)
          }
        )
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
