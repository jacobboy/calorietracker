import MealsComponent from '../containers/meals';
import CreateIngredientInput from '../containers/createingredientinput';
import CreateRecipeInput from '../containers/createrecipe';
import * as React from 'react';
import { TopBitDisplay } from '../types';
  
interface TopBitProps {
    display: TopBitDisplay;
    onIngredientToggle: (destination: TopBitDisplay) => void;
}

export const TopBitComponent = (props: TopBitProps) => {
    let component;
    let button;
    if (props.display === TopBitDisplay.MEALS) {
        component = <MealsComponent />;
        button = (
            <div>
                <button 
                  id="createIngredient" 
                  onClick={() => props.onIngredientToggle(TopBitDisplay.CREATE_INGREDIENT)}
                >
                    Create hell of Ingredient
                </button>
                <button
                  id="createRecipe" 
                  onClick={() => props.onIngredientToggle(TopBitDisplay.CREATE_RECIPE)}
                >
                    Create much Recipe
                </button> 
            </div>
    );  
    } else if (props.display === TopBitDisplay.CREATE_INGREDIENT) {
        component = <CreateIngredientInput/>;
        button = (
            <div>
                <button 
                  id="cancel" 
                  onClick={() => props.onIngredientToggle(TopBitDisplay.MEALS)}
                >
                    Cancel                
                </button>
                <button 
                  id="createRecipe" 
                  onClick={() => props.onIngredientToggle(TopBitDisplay.CREATE_RECIPE)}
                >
                    Create much Recipe
                </button> 
            </div>
        );
    } else if (props.display === TopBitDisplay.CREATE_RECIPE) {
        component = <CreateRecipeInput />; 
        button = (
            <div>
                <button 
                  id="createIngredient" 
                  onClick={() => props.onIngredientToggle(TopBitDisplay.CREATE_INGREDIENT)}
                >
                    Create hell of Ingredient
                </button>
                <button 
                  id="cancel" 
                  onClick={() => props.onIngredientToggle(TopBitDisplay.MEALS)}
                >
                    Cancel                
                </button>
            </div>
        );
    }    
    return (
        <div>
            {component}
            {button}
        </div>
    );
};