import React, { useEffect, useState } from 'react';
import './App.css';
import {
  CustomIngredient,
  CustomIngredientUnsaved,
  IngredientSource,
  PortionMacros,
  RecipeItemUnsaved,
  RecipeUnsaved,
  Unit
} from "./classes";
import { MathInputState } from "./conversions";
import { Recipe } from "./recipe";
import { IngredientSearch } from "./ingredientSearch";
import { CreateIngredient } from "./createIngredient";
import {
  loadRecentlyCreatedCustomIngredients,
  persistCustomIngredient,
  persistRecipe
} from "./firebaseApi/api";
import { initFirebaseApp } from "./firebase-config";

initFirebaseApp()

const initalRecipe: RecipeUnsaved = {
  name: {
    value: '',
    isValid: false
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

  function addRecipeItem(source: IngredientSource) {
    return (fromPortion: PortionMacros, enteredAmount: MathInputState) => {
      return () => {
        const recipeItem: RecipeItemUnsaved = {
          source,
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
            ...oldItem,
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
    setRecipe((prevState) => {
      return {
        ...prevState,
        isValid
      }
    })
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

  function setRecipeAmount(amount: MathInputState) {
    setRecipe((prevState) => {
          return {
            ...prevState,
            amount
          }
        }
    )
  }

  function clearRecipe() {
    setRecipe(initalRecipe)
  }

  function saveRecipe() {
    if (recipe.isValid) {
      setRecipeSaving(true)
      persistRecipe(recipe).then((createdRecipe) => {
        setRecipeSaving(false)
        clearRecipe()
        setCreatedIngredients((prevState) => [createdRecipe, ...prevState])
      })
    }
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
          clearRecipe,
          setRecipeAmount
      )}
      {CreateIngredient(createIngredient)}
      {IngredientSearch(
          addRecipeItem,
          createdIngredients
      )}
    </div>
  );
}

export default App;
