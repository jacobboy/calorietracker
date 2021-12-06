import React, { useEffect, useState } from 'react';
import './App.css';
import {
  CustomIngredient,
  CustomIngredientUnsaved,
  IngredientId,
  PortionMacros,
  RecipeItemUnsaved,
  RecipeUnsaved,
  Unit
} from "./classes";
import { MathInputState } from "./conversions";
import { Recipe } from "./recipe";
import { IngredientSearch } from "./ingredientSearch";
import { CreateIngredient } from "./createIngredient";
import { loadRecentlyCreatedCustomIngredients, persistCustomIngredient } from "./firebaseApi/api";
import { initFirebaseApp } from "./firebase-config";

initFirebaseApp()

const initalRecipe: RecipeUnsaved = {
  name: {
    value: 'Hell of recipe',
    isValid: true
  },
  amount: {input: '100', isValid: true, evaluated: 100},
  unit: Unit.g,
  ingredients: [],
  isValid: false
}

function App() {
  const [recipe, setRecipe] = useState<RecipeUnsaved>(initalRecipe)
  const [createdIngredients, setCreatedIngredients] = useState<CustomIngredient[]>([])
  const [recipeSaving, setRecipeSaving] = useState<boolean>(false)

  useEffect(() => {
    getRecentCustomIngredients()
  }, [])

  function addFdcRecipeItem(id: IngredientId, name: string) {
    return (fromPortion: PortionMacros, enteredAmount: MathInputState) => {
      return () => {
        const recipeItem: RecipeItemUnsaved = {
          name: name,
          id: id,
          macros: fromPortion,
          amount: enteredAmount,
        }
        setRecipe(
            (prevState: RecipeUnsaved) => {
              return {
                ...prevState, ingredients: [...recipe.ingredients, recipeItem]
              }
            }
        )
        checkRecipeValidity()
      }
    }
  }

  function changeRecipeItemAmount(idx: number) {
    return (input: string, evaluated: number, isValid: boolean) => {
        setRecipe((prevState) => {
          const oldItem = prevState.ingredients[idx]
          const newItem: RecipeItemUnsaved = {
            name: oldItem.name,
            id: oldItem.id,
            macros: oldItem.macros,
            amount: {input, evaluated, isValid},
          }
          return {
            ...prevState,
            ingredients: [...prevState.ingredients.slice(0, idx), newItem, ...prevState.ingredients.slice(idx +1)]
          }
        });
        checkRecipeValidity()
    }
  }

  function removeRecipeItem(idx: number) {
    setRecipe((prevState) => {
      return {
        ...prevState,
        ingredients: [
          ...prevState.ingredients.slice(0, idx), ...prevState.ingredients.slice(idx + 1)
        ]
      }
    })
    checkRecipeValidity()
  }

  function checkRecipeValidity() {
    const isValid: boolean = (
        recipe.ingredients.length > 0 &&
        recipe.ingredients.map((i) => i.amount.isValid).every((b) => b) &&
            recipe.name.isValid
    )
    if (recipe.isValid !== isValid) {
      setRecipe((prevState) => {
        return {
          ...prevState,
          isValid
        }
      })
    }
  }

  function setRecipeName(name: string) {
    setRecipe((prevState) => {
          return {
            ...prevState,
            name: {
              value: name,
              isValid: name !== ''
            }
          }
        }
    )
    checkRecipeValidity()
  }

  function clearRecipe() {
    setRecipe(initalRecipe)
  }

  function saveRecipe() {
    if (recipe.isValid) {
      setRecipeSaving(true)

      setRecipeSaving(false)
    }
    clearRecipe()
  }

  function getRecentCustomIngredients() {
    loadRecentlyCreatedCustomIngredients().then((recentIngredients) => {
      setCreatedIngredients(recentIngredients)
    })
  }


  function createIngredient(ingredient: CustomIngredientUnsaved) {
    persistCustomIngredient(ingredient).then((ingredient) => {
      setCreatedIngredients((prevState) => [ingredient, ...prevState])
    })
  }

  return (
    <div className="App">
      {Recipe(
          recipe,
          changeRecipeItemAmount,
          removeRecipeItem,
          setRecipeName,
          recipeSaving,
          saveRecipe,
          clearRecipe
      )}
      {CreateIngredient(createIngredient)}
      {IngredientSearch(
          addFdcRecipeItem,
          createdIngredients
      )}
    </div>
  );
}

export default App;
