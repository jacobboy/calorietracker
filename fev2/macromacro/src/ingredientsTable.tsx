import React from 'react';
import './App.css';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { PortionMacros, IngredientRowData, IngredientId } from "./classes";
import { MathInput, MathInputState, round } from "./conversions";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { CircularProgress } from "@mui/material";

function PortionTableRow(
    row: IngredientRowData,
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
        <TableRow key={`${row.id}-${idx}-details`}>
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

function Row(
    row: IngredientRowData,
    macros: PortionMacros[],
    open: boolean,
    toggleOpen: () => void,
    portionAmounts: Record<number, MathInputState>,
    changePortionAmount: (portionIdx: number) => (input: string, evaluated: number, isValid: boolean) => void,
    addRecipeItem: (portionIdx: number, amount: MathInputState) => () => void
) {

    const thinking = open && macros.length === 0
    return (
        <React.Fragment key={`${row.id}-frag`}>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}} key={`${row.id}-simple`}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => toggleOpen()}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    <a target="_blank" rel="noreferrer"
                       href={`https://fdc.nal.usda.gov/fdc-app.html#/food-details/${row.id}/nutrients`}>{row.name}</a>
                </TableCell>
                <TableCell align="right">{row.dataType}</TableCell>
                <TableCell align="right">{row.brandOwner}</TableCell>
                <TableCell align="right">{row.brandName}</TableCell>
                <TableCell align="right">{`${row.amount} ${row.unit}`}</TableCell>
                <TableCell align="right">{round(row.calories)}</TableCell>
                <TableCell align="right">{round(row.fat)}</TableCell>
                <TableCell align="right">{round(row.carbs)}</TableCell>
                <TableCell align="right">{round(row.protein)}</TableCell>
            </TableRow>
            <TableRow key={`${row.id}-something`}>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit={false}>
                        <Box sx={{margin: 1}}>
                            {/*<Typography variant="h6" gutterBottom component="div">*/}
                            {/*  History*/}
                            {/*</Typography>*/}
                            <Table size="small" aria-label="food details">
                                <TableHead>
                                    <TableRow key={`${row.id}-details-header`}>
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
                                            <tr>
                                                <td colSpan={9}><CircularProgress/></td>
                                            </tr>
                                            :
                                            macros.map(
                                                (macro, idx) => PortionTableRow(
                                                    row,
                                                    idx,
                                                    macro,
                                                    portionAmounts[idx] || {
                                                        input: '',
                                                        isValid: true,
                                                        evaluated: 0
                                                    },
                                                    changePortionAmount(idx),
                                                    addRecipeItem(idx, portionAmounts[idx] || {
                                                        input: '',
                                                        isValid: true,
                                                        evaluated: 0
                                                    })
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

export function IngredientsTable(
    searchData: IngredientRowData[],
    detailedMacros: Record<string, PortionMacros[]>,
    rowsOpen: Record<string, boolean>,
    toggleOpen: (id: IngredientId) => void, enteredAmounts: Record<IngredientId, Record<number, MathInputState>>,
    changePortionAmount: (id: IngredientId) => (portionIdx: number) => (input: string, evaluated: number, isValid: boolean) => void,
    addRecipeItem: (id: IngredientId, name: string) => (portionIdx: number, amount: MathInputState) => () => void
) {
    return <Table sx={{minWidth: 650}} aria-label="simple table">
        <TableHead>
            <TableRow key='header'>
                <TableCell/>
                <TableCell>Food</TableCell>
                <TableCell align="right">Data Type</TableCell>
                <TableCell align="right">Brand Owner</TableCell>
                <TableCell align="right">Brand Name</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Calories</TableCell>
                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                <TableCell align="right">Protein&nbsp;(g)</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {
                searchData.map(
                    (row) => Row(
                        row,
                        detailedMacros[row.id] || [],
                        rowsOpen[row.id],
                        () => toggleOpen(row.id),
                        enteredAmounts[row.id] || {},
                        changePortionAmount(row.id),
                        addRecipeItem(row.id, row.name)
                    )
                )
            }
        </TableBody>
    </Table>;
}