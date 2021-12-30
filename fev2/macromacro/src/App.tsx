import React, { useEffect, useState } from 'react';
import './App.css';
import {
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
import { FirebaseAPI } from "./firebaseApi/api";

import { Button } from '@mui/material';
import { User } from "firebase/auth";

const initalRecipe: RecipeUnsaved = {
  name: {
    value: '',
    isValid: false
  },
  amount: {input: '', isValid: false, evaluated: NaN},
  unit: Unit.g,
  ingredients: [],
  isValid: false
}

function App({firebaseApi= new FirebaseAPI()}) {
  const [recipe, setRecipe] = useState<RecipeUnsaved>(initalRecipe)
  const [recipeSaving, setRecipeSaving] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    firebaseApi.registerAuthCallback(setUser)
  }, [])

  function copyRecipe(recipe: RecipeUnsaved) {
    setRecipe((prevState) => {
      return recipe
    })
  }

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
            recipe.name.isValid &&
            recipe.amount.isValid
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
      firebaseApi.persistRecipe(recipe).then((createdRecipe) => {
        setRecipeSaving(false)
        clearRecipe()
      })
    }
  }

  function createIngredient(ingredient: CustomIngredientUnsaved) {
    firebaseApi.persistCustomIngredient(ingredient)
  }

  return (
      <>
        <Button onClick={firebaseApi.signOut}>Sign Out</Button>
        {
          Recipe(
              recipe,
              changeRecipeItemAmount,
              removeRecipeItem,
              setRecipeName,
              recipeSaving,
              saveRecipe,
              clearRecipe,
              setRecipeAmount
          )
        }
        {CreateIngredient(createIngredient)}
        {IngredientSearch(addRecipeItem, copyRecipe)}
      </>
  );
}

export default App;
