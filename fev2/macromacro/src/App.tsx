import React, { ChangeEvent, useState } from 'react';
import './App.css';
import Input from '@mui/material/Input';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  AbridgedFoodNutrient,
  BrandedFoodItem,
  Configuration,
  FDCApi,
  FoundationFoodItem,
  SearchResultFood,
  SRLegacyFoodItem,
  SurveyFoodItem
} from "./usda";
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { CircularProgress, TextField } from "@mui/material";
import { Parser } from "expr-eval";

enum Unit {
  g = 'g',
  ml = 'ml'
}

type Source = 'portion' | '100g' | 'labelNutrients'

const ariaLabel = { 'aria-label': 'description' };

function round(x?: number) {
  return x !== undefined ? Math.round(x * 10) / 10 : x
}

interface SimpleMacros {
  calories?: number,
  carbs?: number,
  fat?: number,
  protein?: number
  amount: number,
  unit: Unit,
  description: string
}

interface DetailedMacros extends SimpleMacros {
  totalFiber?: number,
  // solubleFiber?: number,
  // insolubleFiber?: number,
  sugar?: number,
}

interface PortionMacros extends DetailedMacros {
  source: Source,
  id?: number,
  baseMacros: DetailedMacros
}

interface RowData extends SimpleMacros {
  dataType?: string,
  brandOwner?: string,
  fdcId: number,
  name: string,
  householdServingFullText?: string
}

const simpleMacrosMap = {
  calories: "208",
  carbs: "205",
  protein: "203",
  fat: "204"
};

const macrosMap = {
  ...simpleMacrosMap,
  totalFiber: "291",
  sugar: "269"
};

function multiply100gMacro(
    macros100g: DetailedMacros,
    description: string,
    amount: number,
    source: Source,
    id?: number
): PortionMacros {
  const scalePerGram = amount / macros100g.amount
  return {
    calories: macros100g.calories !== undefined ? macros100g.calories * scalePerGram : undefined,
    carbs: macros100g.carbs !== undefined ? macros100g.carbs * scalePerGram : undefined,
    protein: macros100g.protein !== undefined ? macros100g.protein * scalePerGram : undefined,
    fat: macros100g.fat !== undefined ? macros100g.fat * scalePerGram : undefined,
    totalFiber: macros100g.totalFiber !== undefined ? macros100g.totalFiber * scalePerGram : undefined,
    sugar: macros100g.sugar !== undefined ? macros100g.sugar * scalePerGram : undefined,
    amount: amount,
    unit: macros100g.unit,
    description: description,
    baseMacros: macros100g,
    source,
    id
  }
}

function getDetailedMacrosForMeasures(
    foodItem: BrandedFoodItem | FoundationFoodItem | SRLegacyFoodItem | SurveyFoodItem
): PortionMacros[] {
  const macros100g: DetailedMacros = {
    amount: 100,
    unit: Unit.g,
    description: '100 g',
  };

  (foodItem.foodNutrients || []).forEach((nutrient) => {
    (Object.entries(macrosMap) as [keyof typeof macrosMap, string][]).forEach(
        ([field, nutrientNumber]) => {
          if (nutrient.nutrient?.number === nutrientNumber) {
              macros100g[field] = nutrient.amount
          }
        }
    )
  })

  const portions: PortionMacros[] = []
  if ('foodPortions' in foodItem && foodItem.foodPortions) {
    foodItem.foodPortions.forEach((foodPortion) => {
      let description;
      // foundation foods have measure units?
      if (foodPortion.measureUnit?.name && foodPortion.measureUnit.name !== 'undetermined') {
        description = `${foodPortion.measureUnit?.name} ${foodPortion.portionDescription || 'not set'}`
      } else {
        description = foodPortion.portionDescription || 'not set'
      }

      // 0 so i can see in the UI when this was missing
      const gramWeight = foodPortion.gramWeight || 0

      portions.push(multiply100gMacro(macros100g, description, gramWeight, 'portion', foodPortion.id))
    })
  }
  // branded
  if ('labelNutrients' in foodItem) {
    portions.push(
        {
          calories: foodItem.labelNutrients?.calories?.value,
          carbs: foodItem.labelNutrients?.carbohydrates?.value,
          fat: foodItem.labelNutrients?.fat?.value,
          protein: foodItem.labelNutrients?.protein?.value,
          totalFiber: foodItem.labelNutrients?.fiber?.value,
          sugar: foodItem.labelNutrients?.sugars?.value,
          amount: foodItem.servingSize || 0,
          unit: Unit[((foodItem.servingSizeUnit || 'g') as keyof typeof Unit)],
          description: foodItem.householdServingFullText || `${foodItem.servingSize || 'not set'} ${foodItem.servingSizeUnit || 'not set'}`,
          source: 'labelNutrients',
          baseMacros: macros100g
        }
    )
  }

  return [{...macros100g, baseMacros: macros100g, source: '100g'}, ...portions];
}

function getMacros(foodNutrients: AbridgedFoodNutrient[]): SimpleMacros {
  const macros: SimpleMacros = {
    unit: Unit.g,
    amount: 100,
    description: '100 g'
  }

  foodNutrients.forEach((nutrient) => {
    (Object.entries(simpleMacrosMap) as [keyof typeof simpleMacrosMap, string][]).forEach(
        ([field, nutrientNumber]) => {
          if (nutrient.nutrientNumber === nutrientNumber) {
            macros[field] = nutrient.value
          }
        })
  })

  return macros;
}

function getMeasuresForOneFood(fdcId: number): Promise<PortionMacros[]> {
  const api = getApiClient()
  return api.getFullFood(fdcId.toString()).then(
      (response) => {
        if (response.data) {
          return getDetailedMacrosForMeasures(response.data)
        } else {
          throw new Error('got a woopsies')
        }
      }
  )
}

function getApiClient(): FDCApi {
  const config = new Configuration({
    apiKey: 'bu776D0hQ8ZBGC3g1eoUB3iNwknI6MJhNo1xzwRh',
    baseOptions: {
      withCredentials: false
    }
  })
  return new FDCApi(config);
}

export interface MathInputState {
  input: string,
  isValid: boolean,
  evaluated: number
}

function MathInput(
    value: string,
    isValid: boolean,
    onChange: (input: string, evaluated: number, isValid: boolean) => void
) {
  function handleChange(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    try {
      const evaluated = Parser.evaluate(event.target.value)
      onChange(event.target.value, evaluated, true)
    } catch(error) {
      onChange(event.target.value, 0, false)
    }
  }

  return <TextField
      error={!isValid}
      value={value}
      placeholder="37 * 2 / 3"
      onChange={handleChange}
  />
}

function PortionTableRow(
    row: RowData,
    idx: number,
    macro: PortionMacros,
    portionAmount: MathInputState,
    changePortionAmount: (input: string, evaluated: number, isValid: boolean) => void,
    addRecipeItem: () => void
) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (portionAmount.isValid) {
      addRecipeItem()
    }
    e.preventDefault()
  }
  return (
      <TableRow key={`${row.fdcId}-${idx}-details`}>
        {/*// TODO what is this component and scope*/}
        <TableCell component="th" scope="row">
          <form onSubmit={e => handleSubmit(e)}>
            {MathInput(portionAmount.input, portionAmount.isValid, changePortionAmount)}
          </form>
        </TableCell>
        <TableCell align="right">{macro.description}</TableCell>
        <TableCell align="right">{macro.amount}</TableCell>
        <TableCell align="right">{macro.unit}</TableCell>
        <TableCell align="right">{round(macro.calories)}</TableCell>
        <TableCell align="right">{round(macro.protein)}</TableCell>
        <TableCell align="right">{round(macro.fat)}</TableCell>
        <TableCell align="right">{round(macro.carbs)}</TableCell>
        <TableCell align="right">{round(macro.totalFiber)}</TableCell>
        <TableCell align="right">{round(macro.sugar)}</TableCell>
      </TableRow>
  );
}

function RecipeRow(
    recipeItem: RecipeItem,
    idx: number
    // changePortionAmount: (portionIdx: number) => (input: string, evaluated: number, isValid: boolean) => void,
) {

  const macros = multiply100gMacro(
      recipeItem.macros.baseMacros,
      recipeItem.macros.description,
      recipeItem.amount * recipeItem.macros.amount,
      recipeItem.macros.source,
      recipeItem.macros.id
  )

  return (
      <React.Fragment key={`${recipeItem.fdcId}-${idx}-recipe-frag`}>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} key={`${recipeItem.fdcId}-${idx}-recipeitem`}>
          <TableCell component="th" scope="row">
            <a target="_blank" rel="noreferrer" href={`https://fdc.nal.usda.gov/fdc-app.html#/food-details/${recipeItem.fdcId}/nutrients`}>{recipeItem.name}</a>
          </TableCell>
          <TableCell align="right">{recipeItem.amount}</TableCell>
          <TableCell align="right">{recipeItem.macros.description}</TableCell>
          <TableCell align="right">{round(macros.calories)}</TableCell>
          <TableCell align="right">{round(macros.fat)}</TableCell>
          <TableCell align="right">{round(macros.carbs)}</TableCell>
          <TableCell align="right">{round(macros.protein)}</TableCell>
          <TableCell align="right">{round(macros.totalFiber)}</TableCell>
          <TableCell align="right">{round(macros.sugar)}</TableCell>
        </TableRow>
      </React.Fragment>
  );
}

function Row(
    row: RowData,
    macros: PortionMacros[],
    open: boolean,
    toggleOpen: () => void,
    portionAmounts: Record<number, MathInputState>,
    changePortionAmount: (portionIdx: number) => (input: string, evaluated: number, isValid: boolean) => void,
    addRecipeItem: (portionIdx: number) => () => void
) {

  const thinking = open && macros.length === 0
  return (
      <React.Fragment key={`${row.fdcId}-frag`}>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} key={`${row.fdcId}-simple`}>
          <TableCell>
            <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => toggleOpen()}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            <a target="_blank" rel="noreferrer" href={`https://fdc.nal.usda.gov/fdc-app.html#/food-details/${row.fdcId}/nutrients`}>{row.name}</a>
          </TableCell>
          <TableCell align="right">{row.dataType}</TableCell>
          <TableCell align="right">{row.brandOwner}</TableCell>
          <TableCell align="right">{`${row.amount} ${row.unit}`}</TableCell>
          <TableCell align="right">{round(row.calories)}</TableCell>
          <TableCell align="right">{round(row.fat)}</TableCell>
          <TableCell align="right">{round(row.carbs)}</TableCell>
          <TableCell align="right">{round(row.protein)}</TableCell>
        </TableRow>
        <TableRow key={`${row.fdcId}-something`}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit={false}>
              <Box sx={{ margin: 1 }}>
                {/*<Typography variant="h6" gutterBottom component="div">*/}
                {/*  History*/}
                {/*</Typography>*/}
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow key={`${row.fdcId}-details-header`}>
                      <TableCell align="left">Add amount to recipe</TableCell>
                      <TableCell align="right">Description</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Unit</TableCell>
                      <TableCell align="right">Calories</TableCell>
                      <TableCell align="right">Protein</TableCell>
                      <TableCell align="right">Fat</TableCell>
                      <TableCell align="right">Carbs</TableCell>
                      <TableCell align="right">Total Fiber</TableCell>
                      <TableCell align="right">Sugar</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      thinking ?
                          <tr><td colSpan={9}><CircularProgress /></td></tr>
                          :
                          macros.map(
                              (macro, idx) => PortionTableRow(
                                  row,
                                  idx,
                                  macro,
                                  portionAmounts[idx] || {input: '', isValid: true, evaluated: 0},
                                  changePortionAmount(idx),
                                  addRecipeItem(idx)
                              )
                          )
                    }
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
  );
}

interface RecipeItem {
  name: string,
  fdcId: number,
  macros: PortionMacros,
  amount: number
}

function App() {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultFood[]>([]);
  const [detailedMacros, setDetailedMacros] = useState<Record<string, PortionMacros[]>>({})
  const [rowsOpen, setRowsOpen] = useState<Record<string, boolean>>({})
  const [recipeItems, setRecipeItems] = useState<RecipeItem[]>([])
  const [enteredAmounts, setEnteredAmounts] = useState<Record<number, Record<number, MathInputState>>>({})

  function createData(searchResult: SearchResultFood): RowData {
      return {
        dataType: searchResult.dataType,
        brandOwner: searchResult.brandOwner,
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
            setDetailedMacros({
              ...detailedMacros,
              [fdcId]: detailedMacro
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

  function addRecipeItem(fdcId: number) {
    return (portionIdx: number) => {
      return () => {
        const fromPortion: PortionMacros = detailedMacros[fdcId][portionIdx]
        const recipeItem: RecipeItem = {
          name: fromPortion.description,
          fdcId: fdcId,
          macros: fromPortion,
          amount: enteredAmounts[fdcId][portionIdx].evaluated
        }
        setRecipeItems([...recipeItems, recipeItem])
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
      <header className="App-header">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow key='header'>
                <TableCell />
                <TableCell>Food</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Description</TableCell>
                <TableCell align="right">Calories</TableCell>
                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                <TableCell align="right">Protein&nbsp;(g)</TableCell>
                <TableCell align="right">Total Fiber</TableCell>
                <TableCell align="right">Sugar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                recipeItems.map(
                    (recipeItem, idx) => RecipeRow(recipeItem, idx)
                )
              }
            </TableBody>
          </Table>
        </TableContainer>
        <form onSubmit={search}>
          <Input placeholder="Placeholder" value={searchText} onChange={e => setSearchText(e.target.value)} inputProps={ariaLabel} />
          <input type="submit" value="Submit" />
        </form>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow key='header'>
                <TableCell />
                <TableCell>Food</TableCell>
                <TableCell align="right">Data Type</TableCell>
                <TableCell align="right">Brand Owner</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Calories</TableCell>
                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                <TableCell align="right">Protein&nbsp;(g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                searchResults.map(createData).map(
                    (row) => Row(
                        row,
                        detailedMacros[row.fdcId] || [],
                        rowsOpen[row.fdcId],
                        () => toggleOpen(row.fdcId),
                        enteredAmounts[row.fdcId] || {},
                        changePortionAmount(row.fdcId),
                        addRecipeItem(row.fdcId)
                    )
                )
              }
            </TableBody>
          </Table>
        </TableContainer>
      </header>
    </div>
  );
}

export default App;
