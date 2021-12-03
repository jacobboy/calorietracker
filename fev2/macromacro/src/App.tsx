import React, { useState } from 'react';
import './App.css';
import { Ingredient, IngredientId, IngredientRowData, PortionMacros, RecipeItem } from "./classes";
import { MathInputState } from "./conversions";
import { getMeasuresForOneFood } from "./calls";
import { Recipe } from "./recipe";
import { IngredientSearch } from "./ingredientSearch";
import { CreateIngredient } from "./createIngredient";

// import { firebaseApp } from './firebase-config'



function App() {
  // const [searchResults, setSearchResults] = useState<SearchResultFood[]>([]);
  // TODO move searchData into IngredientSearch?
  const [detailedMacros, setDetailedMacros] = useState<Record<IngredientId, PortionMacros[]>>({})
  const [recipeItems, setRecipeItems] = useState<RecipeItem[]>([])
  const [createdIngredients, setCreatedIngredients] = useState<Ingredient[]>([])

  function createCreatedIngredientRowData(ingredient: Ingredient): IngredientRowData {
    return {
      dataType: 'createdIngredient',
      brandOwner: ingredient.brandOwner,
      brandName: ingredient.brandName,
      id: ingredient.id,
      name: ingredient.name,
      ...ingredient.macros,
      // householdServingFullText: ingredient.householdServingFullText
    }
  }

  function getFood(id: IngredientId) {
    if (!(id in detailedMacros)) {
      getMeasuresForOneFood(id).then(
          (detailedMacro) => {
            setDetailedMacros((prevState) => {
              return {...prevState, [id]: detailedMacro}
            })
          }
      )
    }
  }

  function addFdcRecipeItem(id: IngredientId, name: string) {
    return (portionIdx: number, enteredAmount: MathInputState) => {
      return () => {
        const fromPortion: PortionMacros = detailedMacros[id][portionIdx]
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


  function createIngredient(ingredient: Ingredient) {
    setCreatedIngredients((prevState) => [...prevState, ingredient])
    // TODO set detailed macros\
    // handle is open for created ingredients
  }

  return (
    <div className="App">
      {Recipe(recipeItems, changeRecipeItemAmount)}
      {CreateIngredient(createIngredient)}
      {IngredientSearch(
          detailedMacros,
          addFdcRecipeItem,
          getFood,
          createdIngredients.map(createCreatedIngredientRowData)
      )}
    </div>
  );
}

export default App;
