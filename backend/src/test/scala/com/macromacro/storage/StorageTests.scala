package com.macromacro.storage

import com.google.appengine.tools.development.testing.LocalServiceTestHelper
import com.google.appengine.tools.development.testing.LocalSearchServiceTestConfig
import org.openapitools.server.model.{ AmountOfIngredient, NamedMacros, NewIngredient, NewRecipe, Recipe }
import org.scalatest.{ BeforeAndAfter, FunSuite }

class StorageSpec extends FunSuite with BeforeAndAfter {
  val helper = new LocalServiceTestHelper(new LocalSearchServiceTestConfig())

  before {
    helper.setUp
  }

  after {
    helper.tearDown()
  }

  test("ingredient returned by saveIngredient matches input") {
    val newIngredient = NewIngredient("test", 1, 2, 3, 4, 5, "g")
    val ingredient = Storage.saveIngredient(newIngredient)

    val foundNewIngredient = NewIngredient(
      ingredient.name, ingredient.fat, ingredient.carbs, ingredient.protein,
      ingredient.calories, ingredient.amount, ingredient.unit)

    assert(newIngredient === foundNewIngredient)
  }

  test("saved ingredients can be retrieved") {
    val newIngredient = NewIngredient("test", 1, 2, 3, 4, 5, "g")
    val ingredient = Storage.saveIngredient(newIngredient)
    val namedMacro = Storage.getIngredient(ingredient.uid)

    val foundNewIngredient = NewIngredient(
      namedMacro.name, namedMacro.fat, namedMacro.carbs, namedMacro.protein,
      namedMacro.calories, namedMacro.amount, namedMacro.unit)

    assert(newIngredient === foundNewIngredient)
  }

  test("macro returned by saveRecipe matches input") {
    val newIngredient1 = NewIngredient("test", 10, 20, 30, 40, 50, "g")
    val ingredient1 = Storage.saveIngredient(newIngredient1)
    val newIngredient2 = NewIngredient("test", 1, 2, 3, 4, 5, "g")
    val ingredient2 = Storage.saveIngredient(newIngredient2)

    val foods = List(
      AmountOfIngredient(ingredient1.amount * 2, ingredient1.uid),
      AmountOfIngredient(ingredient2.amount * 2, ingredient2.uid))

    val totalSize = 100
    val portionSize = 50
    val newRecipe = NewRecipe("test", foods, totalSize, portionSize, "g")
    val namedMacros = Storage.saveRecipe(newRecipe)

    val expectedMacros = NamedMacros(
      namedMacros.uid,
      "test",
      (20 + 2) / 2, (40 + 4) / 2, (60 + 6) / 2, (80 + 8) / 2,
      50, "g")

    assert(namedMacros === expectedMacros)
  }

  test("saved recipes can be retrieved") {
    val newIngredient = NewIngredient("test", 1, 2, 3, 4, 5, "g")
    val ingredient = Storage.saveIngredient(newIngredient)
    val newRecipe = NewRecipe("test", List(AmountOfIngredient(8, ingredient.uid)), 100, 50, "g")

    val recipeMacros = Storage.saveRecipe(newRecipe)

    val foundRecipe = Storage.getRecipe(recipeMacros.uid)

    val expectedRecipe = Recipe(
      foundRecipe.uid,
      "test",
      recipeMacros.fat,
      recipeMacros.carbs,
      recipeMacros.protein,
      recipeMacros.calories,
      recipeMacros.unit,
      List(ingredient),
      100,
      50)

    assert(foundRecipe === expectedRecipe)
  }

  test("TODO: can store recipes as part of recipes") {
    assert(false)
  }
}
