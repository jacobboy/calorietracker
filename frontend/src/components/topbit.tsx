import MealsComponent from '../containers/meals';
import CreateIngredientInput from '../containers/createingredientinput';
import * as React from 'react';
import { TopBitDisplay } from '../types';
  
interface TopBitProps {
    display: TopBitDisplay;
    onIngredientToggle: (destination: TopBitDisplay) => void;
}

/* export class TopBitComponent extends React.Component<{}> {
    render() {

        return (
            <div>
                <MealsComponent />
                <CreateIngredientInput />
            </div>
        );
    }
} */

export const TopBitComponent = (props: TopBitProps) => {
    let component;
    if (props.display === TopBitDisplay.MEALS) {
        component = (
        <div>
            <MealsComponent />
            <button onClick={() => props.onIngredientToggle(TopBitDisplay.CREATE_INGREDIENT)}>
                Create hell of Ingredient
            </button>   
        </div>);
    } else {
        component = (
        <div>
            <CreateIngredientInput/>
            <button onClick={() => props.onIngredientToggle(TopBitDisplay.MEALS)}>
                Cancel                
            </button>
        </div>
        );
    }
    return component;
};