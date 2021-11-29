import React, { useState } from 'react';
import './App.css';
import Input from '@mui/material/Input';
// import { initializeApp } from 'firebase/app';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { AbridgedFoodNutrient, Configuration, FDCApi, SearchResultFood } from "./usda";

const ariaLabel = { 'aria-label': 'description' };

interface Macros {
  calories?: number,
  carbs?: number,
  fat?: number,
  protein?: number,
  totalFiber?: number,
  solubleFiber?: number,
  insolubleFiber?: number
}

function App() {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultFood[]>([]);

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

  function createData(searchResult: SearchResultFood) {
      return {
        dataType: searchResult.dataType,
        brandOwnder: searchResult.brandOwner,
        fdcId: searchResult.fdcId,
        name: searchResult.description,
        measures: '',
        ...getMacros(searchResult.foodNutrients || []),
        servingSize: searchResult.servingSize,
        servingSizeUnit: searchResult.servingSizeUnit,
        householdServingFullText: searchResult.householdServingFullText
      }
  }

  async function search(event: React.FormEvent<HTMLFormElement>) {
    if (searchText) {
      const config = new Configuration({
        apiKey: 'bu776D0hQ8ZBGC3g1eoUB3iNwknI6MJhNo1xzwRh',
        baseOptions: {
          withCredentials: false
        }
      })
      const api = new FDCApi(config)
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
              <TableRow>
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
              {searchResults.map(createData).map((row) => (
                  <TableRow
                      key={row.fdcId}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <a target="_blank" rel="noreferrer" href={`https://fdc.nal.usda.gov/fdc-app.html#/food-details/${row.fdcId}/nutrients`}>{row.name}</a>
                    </TableCell>
                    <TableCell align="right">{row.dataType}</TableCell>
                    <TableCell align="right">{row.brandOwnder}</TableCell>
                    <TableCell align="right">{`${row.servingSize} ${row.servingSizeUnit}`}</TableCell>
                    <TableCell align="right">{row.calories}</TableCell>
                    <TableCell align="right">{row.fat}</TableCell>
                    <TableCell align="right">{row.carbs}</TableCell>
                    <TableCell align="right">{row.protein}</TableCell>
                  </TableRow>
                  )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </header>
    </div>
  );
}

export default App;
