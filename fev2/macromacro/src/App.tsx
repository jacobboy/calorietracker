import React, { useState } from 'react';
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

enum Unit {
  g = 'g',
  ml = 'ml'
}

const ariaLabel = { 'aria-label': 'description' };

interface Macros {
  calories?: number,
  carbs?: number,
  fat?: number,
  protein?: number
  amount: number,
  unit: Unit,
  description: string
}

interface PortionMacros extends Macros {
  totalFiber?: number,
  // solubleFiber?: number,
  // insolubleFiber?: number,
  sugar?: number,
}

interface RowData extends Macros {
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

function multiply100gMacro(macros100g: PortionMacros, description: string, amount: number): PortionMacros {
  return {
    calories: macros100g.calories !== undefined ? macros100g.calories * amount : undefined,
    carbs: macros100g.carbs !== undefined ? macros100g.carbs * amount : undefined,
    protein: macros100g.protein !== undefined ? macros100g.protein * amount : undefined,
    fat: macros100g.fat !== undefined ? macros100g.fat * amount : undefined,
    totalFiber: macros100g.totalFiber !== undefined ? macros100g.totalFiber * amount : undefined,
    sugar: macros100g.sugar !== undefined ? macros100g.sugar * amount : undefined,
    amount: amount,
    unit: macros100g.unit,
    description: description
  }
}

function getDetailedMacrosForMeasures(
    foodItem: BrandedFoodItem | FoundationFoodItem | SRLegacyFoodItem | SurveyFoodItem
): PortionMacros[] {
  const macros100g: PortionMacros = {
    amount: 100,
    unit: Unit.g,
    description: '100 g'
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
      const description = `${foodPortion.measureUnit?.name || 'not set'} ${foodPortion.portionDescription || 'not set'}`

      // 0 so i can see in the UI when this was missing
      const gramWeight = foodPortion.gramWeight || 0
      // foundation foods
      if ('measureUnit' in foodPortion) {
        portions.push(multiply100gMacro(macros100g, description, gramWeight)
        )
      // survey foods
      } else if ('portionDescription' in foodPortion) {
        portions.push(multiply100gMacro(macros100g, description, gramWeight))
      }
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
          description: foodItem.householdServingFullText || `${foodItem.servingSize || 'not set'} ${foodItem.servingSizeUnit || 'not set'}`
        }
    )
  }

  return [macros100g, ...portions];
}

function getMacros(foodNutrients: AbridgedFoodNutrient[]): Macros {
  const macros: Macros = {
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

function Row(row: RowData, getFood: () => void, macros: PortionMacros[]) {
  const open = macros.length > 0

  return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} key={`${row.fdcId}-simple`}>
          <TableCell>
            <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => getFood()}
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
          <TableCell align="right">{row.calories}</TableCell>
          <TableCell align="right">{row.fat}</TableCell>
          <TableCell align="right">{row.carbs}</TableCell>
          <TableCell align="right">{row.protein}</TableCell>
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
                      macros.map(
                          (macro, idx) => (
                              <TableRow key={`${row.fdcId}-${idx}-details`}>
                                {/*// TODO what is this component and scope*/}
                                <TableCell component="th" scope="row">{macro.description}</TableCell>
                                <TableCell>{macro.amount}</TableCell>
                                <TableCell align="right">{macro.unit}</TableCell>
                                <TableCell align="right">{macro.calories}</TableCell>
                                <TableCell align="right">{macro.protein}</TableCell>
                                <TableCell align="right">{macro.fat}</TableCell>
                                <TableCell align="right">{macro.carbs}</TableCell>
                                <TableCell align="right">{macro.totalFiber}</TableCell>
                                <TableCell align="right">{macro.sugar}</TableCell>
                              </TableRow>
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

function App() {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultFood[]>([]);
  const [detailedMacros, setDetailedMacros] = useState<Record<string, PortionMacros[]>>({})

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

  async function getFood(fdcId: number) {
    getMeasuresForOneFood(fdcId).then(
        (detailedMacro) => {
          setDetailedMacros({
            ...detailedMacros,
            [fdcId]: detailedMacro
          })
        }
    )
  }

  return (
    <div className="App">
      <header className="App-header">
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
                <TableCell align="right">Amount </TableCell>
                <TableCell align="right">Calories</TableCell>
                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                <TableCell align="right">Protein&nbsp;(g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                searchResults.map(createData).map(
                    (row) => Row(row, () => getFood(row.fdcId), detailedMacros[row.fdcId] || [])
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
