import React, { useState } from 'react';
import './App.css';
import { SearchResultFood } from "./usda";
import { PortionMacros, RecipeItem, RowData } from "./classes";
import { getMacros, MathInputState } from "./conversions";
import { getApiClient, getMeasuresForOneFood } from "./calls";
import { Recipe } from "./recipe";
import { IngredientSearch } from "./ingredientSearch";


function App() {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultFood[]>([]);
  const [searchData, setSearchData] = useState<RowData[]>([])
  const [detailedMacros, setDetailedMacros] = useState<Record<string, PortionMacros[]>>({})
  const [rowsOpen, setRowsOpen] = useState<Record<string, boolean>>({})
  const [recipeItems, setRecipeItems] = useState<RecipeItem[]>([])
  const [enteredAmounts, setEnteredAmounts] = useState<Record<number, Record<number, MathInputState>>>({})

  function createData(searchResult: SearchResultFood): RowData {
      return {
        dataType: searchResult.dataType,
        brandOwner: searchResult.brandOwner,
        brandName: searchResult.brandName,
        fdcId: searchResult.fdcId,
        name: searchResult.description,
        ...getMacros(searchResult.foodNutrients || []),
        // householdServingFullText: searchResult.householdServingFullText
      }
  }

  async function search(event: React.FormEvent<HTMLFormElement>) {
    if (searchText) {
      const api = getApiClient();
      api.getFoodsSearch(searchText).then(
          (response) => {
            if (response.data && response.data.foods) {
              setSearchResults(response.data.foods)
              setSearchData(response.data.foods.map(createData))
            }
          }
      )
    }
    event.preventDefault();
  }

  function getFood(fdcId: number) {
    if (!(fdcId in detailedMacros)) {
      getMeasuresForOneFood(fdcId).then(
          (detailedMacro) => {
            setDetailedMacros((prevState: Record<string, PortionMacros[]>) => {
              return {...prevState, [fdcId]: detailedMacro}
            })
          }
      )
    }
  }

  function toggleOpen(fdcId: number) {
    getFood(fdcId)
    setRowsOpen({
      ...rowsOpen,
      [fdcId]: !rowsOpen[fdcId]
    })
  }

  function getNameFromFdcId(fdcId: number) {
    return searchData.find((searchDatum) => searchDatum.fdcId === fdcId)!.name
  }

  function addRecipeItem(fdcId: number) {
    return (portionIdx: number) => {
      return () => {
        const fromPortion: PortionMacros = detailedMacros[fdcId][portionIdx]
        const recipeItem: RecipeItem = {
          name: getNameFromFdcId(fdcId),
          fdcId: fdcId,
          macros: fromPortion,
          amount: enteredAmounts[fdcId][portionIdx].evaluated
        }
        setRecipeItems((prevState: RecipeItem[]) => [...prevState, recipeItem])
      }
    }
  }

  function removeRecipeItem(recipeItem: RecipeItem) {
    setRecipeItems(recipeItems.filter((x) => x !== recipeItem))
  }

  function changePortionAmount(fdcId: number) {
    return ( portionIdx: number) => {
      return (input: string, evaluated: number, isValid: boolean) => {
        setEnteredAmounts(
            {
              ...enteredAmounts,
              [fdcId]: {
                ...(enteredAmounts[fdcId] || {}),
                [portionIdx]: {input, evaluated, isValid}
              }
            }
        )
      }
    }
  }

  return (
    <div className="App">
      {Recipe(recipeItems)}
      {IngredientSearch(
          search,
          searchText,
          setSearchText,
          searchData,
          createData,
          detailedMacros,
          rowsOpen,
          toggleOpen,
          enteredAmounts,
          changePortionAmount,
          addRecipeItem
      )}
    </div>
  );
}

export default App;
