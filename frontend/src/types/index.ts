import { Meal, Ingredient, Recipe, Named, NDBable } from '../classes';
import { DataSource } from '../ndbapi';
import { 
  getAllCustomIngredients, 
  getAllStoredIngredients, 
  getAllRecipes,
 } from '../storage';

interface SavedState {
  ndbs: Ingredient[];
  ingredients: Ingredient[];
  recipes: Recipe[];
}

interface SearchState {
  searchString: string;
  dataSource: DataSource;
  items: (NDBable & Named)[];
}

interface TrackingState {
  mealIdx?: number;
  ingredient?: Ingredient;
}

export enum TopBitDisplay {
  MEALS, CREATE_INGREDIENT
}

export enum Modals {
  NONE, TRACKING, INGREDIENT, RECIPE
}

// um could really do this with just the enum, do i need this whole class?
export class ModalState {
  constructor(
    readonly isOpen: boolean = false,
    private readonly openModal: Modals = Modals.NONE
  ) { /* noop */ }

  openTrackingModal(): ModalState { return new ModalState(true, Modals.TRACKING); }
  openIngredientModal(): ModalState { return new ModalState(true, Modals.INGREDIENT); }
  openRecipeModal(): ModalState { return new ModalState(true, Modals.RECIPE); }
  open(): ModalState { return new ModalState(true, Modals.NONE); }
  close(): ModalState { return new ModalState(false, Modals.NONE); }

  get isTracking(): boolean { return this.openModal === Modals.TRACKING; }
  get isIngredient(): boolean { return this.openModal === Modals.INGREDIENT; }
  get isRecipe(): boolean { return this.openModal === Modals.RECIPE; }
}

export class TopBitState {
  display: TopBitDisplay;
}

export interface StoreState {
  modals: ModalState;
  topbit: TopBitState;
  search: SearchState;
  tracking: TrackingState;
  today: Meal[];
  saved: SavedState;
}

export const initialState: StoreState = {
  modals: new ModalState(),
  topbit: { display: TopBitDisplay.MEALS },
  search: {
    searchString: '',
    dataSource: DataSource.SR,
    items: []
  },
  tracking: {
    mealIdx: undefined,
    ingredient: undefined
  },
  today: [],
  saved: {
    ndbs: getAllStoredIngredients(),
    ingredients: getAllCustomIngredients(),
    recipes: getAllRecipes()
  }
};
