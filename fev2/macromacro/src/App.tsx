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
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

enum Unit {
  g
}

const ariaLabel = { 'aria-label': 'description' };

interface Macros {
  calories?: number,
  carbs?: number,
  fat?: number,
  protein?: number
}

interface PortionMacros extends Macros {
  totalFiber?: number,
  solubleFiber?: number,
  insolubleFiber?: number,
  sugar?: number,
  amount: number,
  unit: Unit,
  description: string
}

interface RowData extends Macros {
  dataType?: string,
  brandOwner?: string,
  fdcId: number,
  name: string,
  servingSize?: number,
  servingSizeUnit?: string,
  householdServingFullText?: string
}

function getDetailedMacrosForMeasures(foodItem: BrandedFoodItem | FoundationFoodItem | SRLegacyFoodItem | SurveyFoodItem): PortionMacros[] {
  const macros100g: PortionMacros = {
    amount: 100,
    unit: Unit.g,
    description: '100 g'
  }

  const macrosMap = {
    calories: "208",
    carbs: "205",
    protein: "203",
    fat: "204",
    totalFiber: "291",
    sugar: "269"
  };

  (foodItem.foodNutrients || []).forEach((nutrient) => {
    (Object.entries(macrosMap) as [keyof typeof macrosMap, string][]).forEach(
        ([field, nutrientNumber]) => {
          if (nutrient.nutrient) {
            if (nutrient.nutrient.number === nutrientNumber) {
              macros100g[field] = nutrient.amount
            }
          }
        }
    )

      // if (nutrient.nutrient) {
      //   if (nutrient.nutrient.number === "208") {
      //     macros100g.calories = nutrient.amount
      //   } else if (nutrient.nutrient.number === "205") {
      //     macros100g.carbs = nutrient.amount
      //   } else if (nutrient.nutrient.number === "203") {
      //     macros100g.protein = nutrient.amount
      //   } else if (nutrient.nutrient.number === "204") {
      //     macros100g.fat = nutrient.amount
      //   } else if (nutrient.nutrient.number === "291") {
      //     macros100g.totalFiber = nutrient.amount
      //   } else if (nutrient.nutrient.number === "269") {
      //     macros100g.sugar = nutrient.amount
      //   }
  })

  return [macros100g];
}

function getMacros(foodNutrients: AbridgedFoodNutrient[]): Macros {
  const macros: Macros = {}

  const macrosMap = {
    calories: "208",
    carbs: "205",
    protein: "203",
    fat: "204",
  }

  foodNutrients.forEach((nutrient) => {
    Object.entries(macrosMap).forEach(([field, nutrientNumber]) => {
      if (nutrient.nutrientNumber === "208") {
        macros.calories = nutrient.value
      } else if (nutrient.nutrientNumber === "205") {
        macros.carbs = nutrient.value
      } else if (nutrient.nutrientNumber === "203") {
        macros.protein = nutrient.value
      } else if (nutrient.nutrientNumber === "204") {
        macros.fat = nutrient.value
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
          const food = response.data
          if ('foodNutrients' in food) {
            return getDetailedMacrosForMeasures(food)
          } else {
            return []
          }
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
          <TableCell align="right">{`${row.servingSize} ${row.servingSizeUnit}`}</TableCell>
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
                      <TableCell>Calories</TableCell>
                      <TableCell>Protein</TableCell>
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
                                <TableCell component="th" scope="row">{macro.calories}</TableCell>
                                <TableCell>{macro.protein}</TableCell>
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
        servingSize: searchResult.servingSize,
        servingSizeUnit: searchResult.servingSizeUnit,
        householdServingFullText: searchResult.householdServingFullText
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
                <TableCell>Food (100g serving)</TableCell>
                <TableCell align="right">Data Type</TableCell>
                <TableCell align="right">Brand Owner</TableCell>
                <TableCell align="right">Serving Size</TableCell>
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
