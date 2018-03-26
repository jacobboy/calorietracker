import { Meal, Ingredient, Recipe, Named, Ingredientable } from '../classes';
import { DataSource } from '../ndbapi';

interface CreatedState {
  ingredients: Ingredient[];
  recipes: Recipe[];
}

interface SearchState {
  searchString: string;
  dataSource: DataSource;
  items: (Ingredientable & Named)[];
}

interface TrackingState {
  mealIdx?: number;
  ingredient?: Ingredient;
}

enum Modals {
  NONE, TRACKING, INGREDIENT, RECIPE
}

// um could really do this with just the enum, do i need this whole class?
export class ModalState {
  private openModal: Modals;

  constructor(openModal: Modals = Modals.NONE) {
    this.openModal = openModal;
  }

  openTrackingModal(): ModalState { return new ModalState(Modals.TRACKING); }
  openIngredientModal(): ModalState { return new ModalState(Modals.INGREDIENT); }
  openRecipeModal(): ModalState { return new ModalState(Modals.RECIPE); }
  close(): ModalState { return new ModalState(); }

  get isOpen(): boolean { return this.openModal !== Modals.NONE; }
  get isTracking(): boolean { return this.openModal === Modals.TRACKING; }
  get isIngredient(): boolean { return this.openModal === Modals.INGREDIENT; }
  get isRecipe(): boolean { return this.openModal === Modals.RECIPE; }
}

export interface StoreState {
  modals: ModalState;
  search: SearchState;
  tracking: TrackingState;
  today: Meal[];
  created: CreatedState;
}

export const initialState: StoreState = {
  modals: new ModalState(),
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
  created: {
    ingredients: [],
    recipes: []
  }
};
