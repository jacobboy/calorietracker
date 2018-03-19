import * as React from 'react';
import { Food } from '../classes';

export function TrackedFood(
  props: {
    mealIdx: number,
    food: Food,
    handleRemoveClick: (mealIdx: number, food: Food) => void
  }
) {
  return (
    <tr>
      <td>{props.food.name}</td>
      <td>{props.food.fat}</td>
      <td>{props.food.protein}</td>
      <td>{props.food.carbs}</td>
      <td>{props.food.calories}</td>
      <td>
        <button
          onClick={() => props.handleRemoveClick(props.mealIdx, props.food)}
        >
          Remove
        </button>
      </td>
    </tr>
  );
}
