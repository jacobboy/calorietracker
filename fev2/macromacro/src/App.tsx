import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import {
  CustomIngredientUnsaved,
  IngredientSource,
  PortionMacros,
  RecipeAndIngredient,
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
  const searchRef = useRef<HTMLInputElement>(null)


  useEffect(() => {
    firebaseApi.registerAuthCallback(setUser)
  }, [])

  function copyRecipe(recipe: RecipeAndIngredient) {
    setRecipe((prevState) => {
      let recipeUnsaved: RecipeUnsaved = {
        ingredients: recipe.ingredients.map((ingredient) => {
          return {
            source: ingredient.source,
            macros: ingredient.macros,
            amount:{
              input: ingredient.amount.toString(),
              isValid: true,
              evaluated: ingredient.amount
            }
          }
        }),
        amount: {
          input: recipe.amount.toString(),
          isValid: true,
          evaluated: recipe.amount
        },
        unit: recipe.unit,
        name: {
          value: recipe.name,
          isValid: true
        },
        isValid: true
      };
      return recipeUnsaved
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
        if (searchRef.current) {
          searchRef.current.focus()
          window.scrollTo(0, 0)
        }
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
        {IngredientSearch(addRecipeItem, copyRecipe, searchRef)}
      </>
  );
}

export default App;
