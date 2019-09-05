package com.macromacro.storage

import com.macromacro.settings.Settings
import com.typesafe.config.ConfigFactory
import com.google.appengine.tools.development.testing.LocalServiceTestHelper
import com.google.appengine.tools.development.testing.LocalSearchServiceTestConfig
import com.macromacro.schema._
import org.openapitools.server.model.{ AmountOfIngredient, AmountOfNamedMacros, NamedMacros, NewIngredient, NewRecipe, Recipe }
import org.scalatest.{ BeforeAndAfterAll, BeforeAndAfterEach, FunSuite }
import scala.collection.JavaConversions.mapAsScalaMap
import scala.collection.JavaConversions._

class StorageSpec extends FunSuite with BeforeAndAfterEach with BeforeAndAfterAll {
  var helper = new LocalServiceTestHelper(new LocalSearchServiceTestConfig())
  val testSettings = new Settings(ConfigFactory.parseString("govApiKey: testkey"))
  var storage: Storage = null

  override def beforeEach {
    helper = new LocalServiceTestHelper(new LocalSearchServiceTestConfig())
    helper.setUp
    storage = new Storage()(testSettings)
  }

  override def afterEach {
    helper.tearDown
    helper = null
    storage = null
  }

  // override def afterAll {
  //   helper = null
  // }

  test("ingredient returned by save matches input") {
    val newIngredient = NewIngredient("test", 1, 2, 3, 4, 5, "g")
    val ingredient = storage.save(newIngredient).getOrElse(throw new Exception("could not save ingredient"))

    val foundNewIngredient = NewIngredient(
      ingredient.name, ingredient.fat, ingredient.carbs, ingredient.protein,
      ingredient.calories, ingredient.amount, ingredient.unit)

    assert(newIngredient === foundNewIngredient)
  }

  test("saved ingredients can be retrieved") {
    val newIngredient = NewIngredient("test", 1, 2, 3, 4, 5, "g")
    val ingredient = storage.save(newIngredient).getOrElse(throw new Exception("could not save ingredient"))
    val namedMacro = storage.getIngredient(ingredient.uid).getOrElse(
      throw new Exception(s"$ingredient.uid not found"))

    val foundNewIngredient = NewIngredient(
      namedMacro.name, namedMacro.fat, namedMacro.carbs, namedMacro.protein,
      namedMacro.calories, namedMacro.amount, namedMacro.unit)

    assert(newIngredient === foundNewIngredient)
  }

  test("macro returned by save matches input") {
    val newIngredient1 = NewIngredient("test", 10, 20, 30, 40, 50, "g")
    val ingredient1 = storage.save(newIngredient1).getOrElse(throw new Exception("could not save ingredient"))
    val newIngredient2 = NewIngredient("test", 1, 2, 3, 4, 5, "g")
    val ingredient2 = storage.save(newIngredient2).getOrElse(throw new Exception("could not save ingredient"))

    val foods = List(
      AmountOfIngredient(ingredient1.amount * 2, ingredient1.uid),
      AmountOfIngredient(ingredient2.amount * 2, ingredient2.uid))

    val totalSize = 100
    val portionSize = 50
    val newRecipe = NewRecipe("test", foods, totalSize, portionSize, "g")
    val namedMacros = storage.save(newRecipe)
      .getOrElse(throw new Exception("Somehow threw a connection error"))
      .getOrElse(throw new Exception(s"$newRecipe.uid not found"))

    val expectedMacros = NamedMacros(
      namedMacros.uid,
      "test",
      (20 + 2) / 2, (40 + 4) / 2, (60 + 6) / 2, (80 + 8) / 2,
      50, "g")

    assert(namedMacros === expectedMacros)
  }

  test("saved recipes can be retrieved") {
    val testAmount = 8
    val newIngredient = NewIngredient("test", 1, 2, 3, 4, 5, "g")
    val ingredient = storage.save(newIngredient).getOrElse(throw new Exception("could not save ingredient"))
    val newRecipe = NewRecipe("test", List(AmountOfIngredient(testAmount, ingredient.uid)), 100, 50, "g")

    val recipeMacros = storage.save(newRecipe)
      .getOrElse(throw new Exception("Somehow threw a connection error"))
      .getOrElse(throw new Exception(s"$newRecipe.uid not found"))

    val foundRecipe = storage.getRecipe(recipeMacros.uid).getOrElse(
      throw new Exception(s"$recipeMacros.uid not found"))

    val expectedRecipe = Recipe(
      foundRecipe.uid,
      "test",
      recipeMacros.fat,
      recipeMacros.carbs,
      recipeMacros.protein,
      recipeMacros.calories,
      recipeMacros.unit,
      List(AmountOfNamedMacros(8, ingredient)),
      100,
      50)

    assert(foundRecipe === expectedRecipe)
  }

  test("can store recipes as part of recipes") {
    val testIAmount = 8
    val testRAmount = 10
    val newIngredient = NewIngredient("test", 1, 2, 3, 4, 5, "g")
    val ingredient = storage.save(newIngredient).getOrElse(throw new Exception("could not save ingredient"))
    val testRecipe = NewRecipe("testRecipe", List(AmountOfIngredient(9, ingredient.uid)), 100, 50, "g")

    val savedMacros = storage.save(testRecipe)

    val testRecipeMacros = savedMacros
      .getOrElse(throw new Exception("Somehow threw a connection error"))
      .getOrElse(throw new Exception(s"$testRecipe.uid not found"))

    val recipe = NewRecipe(
      "recipe",
      List(
        AmountOfIngredient(testIAmount, ingredient.uid),
        AmountOfIngredient(testRAmount, testRecipeMacros.uid)),
      100,
      50,
      "g")

    val recipeMacros = storage.save(recipe)
      .getOrElse(throw new Exception("Somehow threw a connection error"))
      .getOrElse(throw new Exception(s"$recipe.uid not found"))

    val foundRecipe = storage.getRecipe(recipeMacros.uid).getOrElse(
      throw new Exception(s"$recipeMacros.uid not found"))

    val expectedRecipe = Recipe(
      foundRecipe.uid,
      "recipe",
      recipeMacros.fat,
      recipeMacros.carbs,
      recipeMacros.protein,
      recipeMacros.calories,
      recipeMacros.unit,
      List(AmountOfNamedMacros(testIAmount, ingredient), AmountOfNamedMacros(testRAmount, testRecipeMacros)),
      100,
      50)

    assert(foundRecipe === expectedRecipe)
  }

  test("recipe saving with unknown ingredients errors") {
    val recipe = NewRecipe("testRecipe", List(AmountOfIngredient(8, RecipeId("fake_uid"))), 100, 50, "g")
    val recipeMacros = storage.save(recipe)
    assert(recipeMacros === Right(Left(List(MissingIngredientError(RecipeId("fake_uid"))))))
  }

  test("search returns some stuff") {
    val newIngredient1 = NewIngredient("search test 1", 10, 20, 30, 40, 50, "g")
    val ingredient1 = storage.save(newIngredient1).getOrElse(throw new Exception("could not save ingredient"))
    val newIngredient2 = NewIngredient("search test 2", 1, 2, 3, 4, 5, "g")
    val ingredient2 = storage.save(newIngredient2).getOrElse(throw new Exception("could not save ingredient"))
    val foods = List(
      AmountOfIngredient(ingredient1.amount * 2, ingredient1.uid),
      AmountOfIngredient(ingredient2.amount * 2, ingredient2.uid))

    val totalSize = 100
    val portionSize = 50
    val newRecipe = NewRecipe("search test 3", foods, totalSize, portionSize, "g")
    val namedMacros = storage.save(newRecipe)

    val results = storage.getIngredientsAndRecipes("search")
    assert(results.isRight)
    assert(results.right.getOrElse(null).length === 3)
  }

  test("a USDA ingredient can be saved and retrieved") {
    val food = CompleteFood(UsdaId("uid"), "name", 1, 2, 3, 29, 100, "g")
    storage.save(food)
    val foundFood = storage.getIngredient(food.uid)
    assert(foundFood.isRight)
    assert(foundFood === Right(food.toNamedMacros))
  }

  test("getting a non-existent ingredient fails gracefully") {
    val uid = IngredientId("snarf")
    val ingredientOption = storage.getIngredient(uid)
    assert(ingredientOption.isLeft)
    assert(ingredientOption === Left(MissingIngredientError(uid)))
  }

  test("creating a Recipe creates an unknown UsdaIngredient") {
    assert(false, "Need to figure out how to patch UsdaClient, or pass it in. Getting a Usda Food is untested.")
  }

  // test("creating a Recipe uses an existing UsdaIngredient if known") {
  //   assert(false)
  // }

}
