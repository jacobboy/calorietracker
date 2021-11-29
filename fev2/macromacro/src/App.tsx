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
import { Configuration, FDCApi, SearchResultFood } from "./usda";

const ariaLabel = { 'aria-label': 'description' };

function App() {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultFood[]>([]);

  function createData(searchResult: SearchResultFood) {
      return {
        name: searchResult.description,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      }
  }

  async function search() {
    console.log('searching');
    if (searchText) {
      console.log('has search teext')
      const config = new Configuration({
        apiKey: 'bu776D0hQ8ZBGC3g1eoUB3iNwknI6MJhNo1xzwRh',
        baseOptions: {
          withCredentials: false
        }
      })
      const api = new FDCApi(config)
      api.getFoodsSearch(searchText).then(
          (response) => {
            if (response.data.foods) {
              setSearchResults(response.data.foods)
              console.log(searchResults)
            } else {
              console.log('nothing found')
            }
          }
      ).catch((error) => {
        console.log('oops')
      })
    }
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
                <TableCell align="right">Calories</TableCell>
                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                <TableCell align="right">Protein&nbsp;(g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchResults.map(createData).map((row) => (
                  <TableRow
                      key={row.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">{row.name}</TableCell>
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
