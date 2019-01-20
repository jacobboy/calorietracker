package com.macromacro.storage

import com.google.appengine.api.search.{ Document, PutException }
import com.google.appengine.api.search.Index;
import com.google.appengine.api.search.IndexSpec;
import com.google.appengine.api.search.Facet;
import com.google.appengine.api.search.Field;
import com.google.appengine.api.search.PutException;
import com.google.appengine.api.search.SearchServiceFactory;
import com.google.appengine.api.search.StatusCode;
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

  private val ingredientIndex = {
    val indexSpec = IndexSpec.newBuilder().setName(ingredientIndexName).build()
    SearchServiceFactory.getSearchService().getIndex(indexSpec)
  }

  private def ingredientId = {
    val uuid = randomUUID
    "ingredient::v1::" + uuid.toString
  }

  private def recipeId = {
    val uuid = randomUUID
    "recipe::v1::" + uuid.toString
  }

  def saveIngredient(newIngredient: NewIngredient) = {
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

    val document = Document.newBuilder.setId(id.toString)
      .addField(Field.newBuilder().setName("name").setText(ingredient.name))
      .addField(Field.newBuilder().setName("body").setText(ingredientJson))
      .addField(Field.newBuilder().setName("created").setDate(new Date()))
      .addFacet(Facet.withAtom("type", "ingredient"))
      .build()

    val indexSpec = IndexSpec.newBuilder().setName(ingredientIndexName).build()
    val index = SearchServiceFactory.getSearchService().getIndex(indexSpec)

    try {
      index.put(document);
    } catch {
      case e: PutException => {
        if (StatusCode.TRANSIENT_ERROR.equals(e.getOperationResult().getCode())) {
          index.put(document);
        }
      }
    }

    ingredient
  }

  def getIngredient(uid: String) = {
    val index = ingredientIndex
    val doc = index.get(uid)
    val ingredientJson = doc.getOnlyField("body").getText

    val ingredient = read[NamedMacros](ingredientJson)
    ingredient
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

  case class StoredRecipe(
    uid: String,
    name: String,
    fat: BigDecimal,
    carbs: BigDecimal,
    protein: BigDecimal,
    calories: BigDecimal,
    unit: String,
    foods: List[AmountOfIngredient],
    totalSize: BigDecimal,
    portionSize: BigDecimal)

  object StoredRecipe {
    def apply(uid: String, name: String, foods: List[AmountOfIngredient], totalSize: BigDecimal,
      portionSize: BigDecimal, unit: String) = {
      val multiplier = portionSize / totalSize
      val _foods = foods.map(f => (f.amount, getIngredient(f.baseFood)))
      val fat = _foods.map(f => f._2.fat * f._1 / f._2.amount).sum * multiplier
      val carbs = _foods.map(f => f._2.carbs * f._1 / f._2.amount).sum * multiplier
      val protein = _foods.map(f => f._2.protein * f._1 / f._2.amount).sum * multiplier
      val calories = _foods.map(f => f._2.calories * f._1 / f._2.amount).sum * multiplier
      new StoredRecipe(uid, name, fat, carbs, protein, calories, unit, foods, totalSize, portionSize)
    }
  }

  def saveRecipe(newRecipe: NewRecipe) = {
    val id = recipeId
    val recipe = StoredRecipe(
      id, newRecipe.name, newRecipe.foods, newRecipe.totalSize,
      newRecipe.portionSize, newRecipe.unit)

    val recipeJson = write(recipe)

    val document = Document.newBuilder.setId(id)
      .addField(Field.newBuilder().setName("name").setText(recipe.name))
      .addField(Field.newBuilder().setName("body").setText(recipeJson))
      .addField(Field.newBuilder().setName("created").setDate(new Date()))
      .addFacet(Facet.withAtom("type", "ingredient"))
      .build()

    val indexSpec = IndexSpec.newBuilder().setName(ingredientIndexName).build()
    val index = SearchServiceFactory.getSearchService().getIndex(indexSpec)

    try {
      index.put(document);
    } catch {
      case e: PutException => {
        if (StatusCode.TRANSIENT_ERROR.equals(e.getOperationResult().getCode())) {
          index.put(document);
        }
      }
    }

    NamedMacros(recipe.uid, recipe.name, recipe.fat, recipe.carbs,
      recipe.protein, recipe.calories, recipe.portionSize, recipe.unit)
  }

  private def getRecipeOrIngredient(uid: String) = {
    uid match {
      case id if id.startsWith("ingredient") => getIngredient(id)
      case id if id.startsWith("recipe") => getIngredient(id)
    }
  }

  def getRecipe(uid: String) = {
    val index = ingredientIndex
    val doc = index.get(uid)
    val recipeJson = doc.getOnlyField("body").getText

    val recipe = read[StoredRecipe](recipeJson)
    val foods = recipe.foods.map(f => getRecipeOrIngredient(f.baseFood))
    Recipe(recipe.uid, recipe.name, recipe.fat, recipe.carbs, recipe.protein, recipe.calories,
      recipe.unit, foods, recipe.totalSize, recipe.portionSize)
  }

}
