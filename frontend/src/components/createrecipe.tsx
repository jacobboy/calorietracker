import { FOOD_UNIT } from '../classes';
import * as React from 'react';
import { tableStyle } from '../style';
import { IngredientsTable, mealCell } from './ingredientstable';
import { currentDate } from '../datautil';
import { AmountOfNamedMacros } from 'src/client';
import { macrosFromFoods } from 'src/transforms';

interface CreateRecipeInputProps {
  foods: AmountOfNamedMacros[];
  handleFoodAmountChange: (food: AmountOfNamedMacros, newAmount: number) => void;
  handleRemoveFoodClick: (food: AmountOfNamedMacros) => void;
  handleSaveRecipeClick: (name: string,
                          foods: AmountOfNamedMacros[],
                          portionSize: number,
                          totalSize: number,
                          unit: string) => void;
}

interface CreateRecipeInputState {
  name: string;
  unit: FOOD_UNIT;
  useCalculatedAmount: boolean;
  totalSize?: number;
  portionSize: number;
}

function emptyState() {
  return {
    name: `${currentDate()} Bitchin\' Recipe`,
    totalSize: undefined,
    unit: FOOD_UNIT.g,
    useCalculatedAmount: true,
    portionSize: 100
  };
}

export class CreateRecipeInput extends React.Component<
  CreateRecipeInputProps, CreateRecipeInputState
  > {

  constructor(props: CreateRecipeInputProps) {
    super(props);
    this.state = emptyState();
  }

  getTotalSize(allowZero: boolean) {
    if (allowZero) {
      if (this.state.totalSize !== undefined) {
        return Number(this.state.totalSize);
      } else {
        return Number(this.props.foods.reduce((l, r) => l + r.amount, 0));
      }
    } else {
      return Number(this.state.totalSize || this.props.foods.reduce((l, r) => l + r.amount, 0));
    }
  }

  onSaveRecipeClick() {
    if (this.props.foods.length > 0) {
      this.props.handleSaveRecipeClick(
        this.state.name, this.props.foods, this.state.portionSize, this.getTotalSize(false), this.state.unit
      );
    }
    this.setState(emptyState());
  }

  handleNameInput(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ name: event.target.value });
  }

  handleAmountInput(event: React.ChangeEvent<HTMLInputElement>) {
    const totalSize = Number(event.target.value);
    this.setState({ totalSize, useCalculatedAmount: false });
  }

  handleUnitInput(event: React.ChangeEvent<HTMLSelectElement>) {
    const unit = FOOD_UNIT[event.target.value];
    if (unit !== undefined) {
      this.setState({ unit });
    }
  }

  handlePortionSizeInput(event: React.ChangeEvent<HTMLInputElement>) {
    const portionSize = Number(event.target.value);
    this.setState({ portionSize });
  }

  macroPortion(macro: number) {
    if (this.getTotalSize(false)) {
      return (
        macro * this.state.portionSize / this.getTotalSize(false)
      ).toFixed();
    } else {
      return 0;
    }
  }

  portionRow() {
    const macros = macrosFromFoods(this.props.foods);
    return (
      <tr key="portionRow">
        <th key="portionTitle">Portion</th>
        <th key="portionInput">
          <input
            id="recipePortionInput"
            type="number"
            // onFocus="this.value=''"
            value={this.state.portionSize}
            onChange={(e) => this.handlePortionSizeInput(e)}
          />
        </th>
        {mealCell(this.state.unit, 'portionUnit')}
        {mealCell(this.macroPortion(macros.fat), 'portionFat', 'portionFat')}
        {mealCell(this.macroPortion(macros.fatPct), 'portionFatPct', 'portionFatPct')}
        {mealCell(this.macroPortion(macros.carbs), 'portionCarbs', 'portionCarbs')}
        {mealCell(this.macroPortion(macros.carbsPct), 'portionCarbsPct', 'portionCarbsPct')}
        {mealCell(this.macroPortion(macros.protein), 'portionProtein', 'portionProtein')}
        {mealCell(this.macroPortion(macros.proteinPct), 'portionProteinPct', 'portionProteinPct')}
        {mealCell(this.macroPortion(macros.calories), 'portionCalories', 'portionCalories')}
      </tr>
    );
  }

  render() {
    return (
      <div>
        <table style={tableStyle}>
          <tbody>
            {IngredientsTable.headerRow()}
            <IngredientsTable
              foods={this.props.foods}
              idx={1}
              handleFoodAmountChange={this.props.handleFoodAmountChange}
              handleRemoveFoodClick={this.props.handleRemoveFoodClick}
              handleDeleteAllClick={() => null}
              handleAmountAllInput={(e) => this.handleAmountInput(e)}
              amount={this.getTotalSize(true)}
              handleUnitAllInput={(e) => this.handleUnitInput(e)}
              unit={this.state.unit}
            />
            {this.portionRow()}
          </tbody>
        </table>
        <form onSubmit={() => this.onSaveRecipeClick()}>
          <label>
            Name:
          <input
              id="recipeNameInput"
              type="text"
              placeholder="Recipe name"
              value={this.state.name || ''}
              onChange={(e) => this.handleNameInput(e)}
          />
          </label>
          <input id="submitIngredient" type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}
