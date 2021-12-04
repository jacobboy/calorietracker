import React, { useState } from 'react';
import './App.css';
import {
  CustomIngredient,
  CustomIngredientUnsaved,
  IngredientId,
  PortionMacros,
  RecipeItem
} from "./classes";
import { MathInputState } from "./conversions";
import { Recipe } from "./recipe";
import { IngredientSearch } from "./ingredientSearch";
import { CreateIngredient } from "./createIngredient";
import { persistCustomIngredient } from "./firebaseApi/api";
import { initFirebaseApp } from "./firebase-config";

const firebaseApp = initFirebaseApp()

function App() {
  const [recipeItems, setRecipeItems] = useState<RecipeItem[]>([])
  const [createdIngredients, setCreatedIngredients] = useState<CustomIngredient[]>([])

  function addFdcRecipeItem(id: IngredientId, name: string) {
    return (fromPortion: PortionMacros, enteredAmount: MathInputState) => {
      return () => {
        const recipeItem: RecipeItem = {
          name: name,
          id: id,
          macros: fromPortion,
          amount: enteredAmount,
        }
        setRecipeItems((prevState: RecipeItem[]) => [...prevState, recipeItem])
      }
    }
  }

  function changeRecipeItemAmount(idx: number) {
    return (input: string, evaluated: number, isValid: boolean) => {
        setRecipeItems((prevState) => {
          const oldItem = prevState[idx]
          const newItem: RecipeItem = {
            name: oldItem.name,
            id: oldItem.id,
            macros: oldItem.macros,
            amount: {input, evaluated, isValid},
          }
          return [...prevState.slice(0, idx), newItem, ...prevState.slice(idx +1)]
        });
    }
  }


  function createIngredient(ingredient: CustomIngredientUnsaved) {
    setCreatedIngredients((prevState) => [
        ...prevState, persistCustomIngredient(ingredient)
    ])
  }

  return (
    <div className="App">
      {Recipe(recipeItems, changeRecipeItemAmount)}
      {CreateIngredient(createIngredient)}
      {IngredientSearch(
          addFdcRecipeItem,
          createdIngredients
      )}
    </div>
  );
}

export default App;
