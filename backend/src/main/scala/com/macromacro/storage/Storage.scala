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

object Storage {

  private val ingredientIndexName = "ingredients"
  private implicit val jsonFormats = Serialization.formats(NoTypeHints) ++ JavaTypesSerializers.all

  private def ingredientId = "ingredient::v1::" + randomUUID.toString
  private def recipeId = "recipe::v1::" + randomUUID.toString

  private def ingredientIndex = {
    val indexSpec = IndexSpec.newBuilder().setName(ingredientIndexName).build()
    SearchServiceFactory.getSearchService().getIndex(indexSpec)
  }

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

  private def scaleMacro(amount: BigDecimal, macros: NamedMacros) = {
    val multiplier = amount / macros.amount
    NamedMacros(
      macros.uid,
      macros.name,
      macros.fat * amount,
      macros.carbs * amount,
      macros.protein * amount,
      macros.calories * amount,
      amount,
      macros.unit)
  }

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

  protected object StoredRecipe {
    def apply(uid: String, name: String, foods: List[AmountOfIngredient], totalSize: BigDecimal,
      portionSize: BigDecimal, unit: String) = {
      val multiplier = portionSize / totalSize
      val _foods = foods.map(f => (f.amount, readToNamedMacros(ingredientIndex.get(f.baseFood))))
      val fat = _foods.map(f => f._2.fat * f._1 / f._2.amount).sum * multiplier
      val carbs = _foods.map(f => f._2.carbs * f._1 / f._2.amount).sum * multiplier
      val protein = _foods.map(f => f._2.protein * f._1 / f._2.amount).sum * multiplier
      val calories = _foods.map(f => f._2.calories * f._1 / f._2.amount).sum * multiplier
      new StoredRecipe(uid, name, fat, carbs, protein, calories, unit, foods, totalSize, portionSize)
    }
  }

  private def readToNamedMacros(doc: Document): NamedMacros = {
    val t = doc.getOnlyField(typeFacet).getAtom
    val body = doc.getOnlyField("body").getText

    t match {
      case "ingredient" => read[NamedMacros](body)
      case "recipe" => read[StoredRecipe](body).toNamedMacros
    }
  }

  def save(newIngredient: NewIngredient) = {
    val id = ingredientId
    val ingredient = NamedMacros(
      id,
      newIngredient.name,
      newIngredient.fat,
      newIngredient.carbs,
      newIngredient.protein,
      newIngredient.calories,
      newIngredient.amount,
      newIngredient.unit)

    val ingredientJson = write(ingredient)

    val document = nameBodyDoc(id, "ingredient", ingredient.name, ingredientJson)

    try {
      ingredientIndex.put(document);
    } catch {
      case e: PutException => {
        if (StatusCode.TRANSIENT_ERROR.equals(e.getOperationResult().getCode())) {
          ingredientIndex.put(document);
        }
      }
    }

    ingredient
  }

  def save(newRecipe: NewRecipe) = {
    val recipe = StoredRecipe(
      recipeId, newRecipe.name, newRecipe.foods, newRecipe.totalSize,
      newRecipe.portionSize, newRecipe.unit)

    val recipeJson = write(recipe)

    val document = nameBodyDoc(recipe.uid, "recipe", recipe.name, recipeJson)

    try {
      ingredientIndex.put(document);
    } catch {
      case e: PutException => {
        if (StatusCode.TRANSIENT_ERROR.equals(e.getOperationResult().getCode())) {
          ingredientIndex.put(document);
        }
      }
    }

    NamedMacros(recipe.uid, recipe.name, recipe.fat, recipe.carbs,
      recipe.protein, recipe.calories, recipe.portionSize, recipe.unit)
  }

  def save(food: FoodFood): Either[IncompleteUsdaNutrient, NamedMacros] = {
    // TODO pull up the decision of whether or not we want to save incomplete ingredients?
    //      edit: I did, but this has to stay until FoodFood can be type checked to be complete
    val namedMacros = food.toNamedMacros
    namedMacros.foreach(
      food => {
        val foodJson = write(food)
        val document = nameBodyDoc(food.uid, "usda", food.name, foodJson)
        ingredientIndex.put(document);
      })
    namedMacros.toRight(IncompleteUsdaNutrient(food.ndbno))
  }

  def getIngredient(uid: String) = {
    val doc = ingredientIndex.get(uid)
    val macrosJson = doc.getOnlyField("body").getText
    read[NamedMacros](macrosJson)
  }

  def getRecipe(uid: String) = {
    val index = ingredientIndex
    val doc = index.get(uid)
    val recipeJson = doc.getOnlyField("body").getText

    val recipe = read[StoredRecipe](recipeJson)
    val foods = recipe.foods.map(f => index.get(f.baseFood)).map(readToNamedMacros(_))
    Recipe(recipe.uid, recipe.name, recipe.fat, recipe.carbs, recipe.protein, recipe.calories,
      recipe.unit, foods, recipe.totalSize, recipe.portionSize)
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
    val results = ingredientIndex.search(query);

    asScalaIterator(results.iterator).map(readToNamedMacros(_)).toList
  }

  def deleteItem(uid: String) = {
    ingredientIndex.delete(uid)
  }
}
