import { Meal, Ingredient, Recipe } from '../classes';
import { DataSource } from '../ndbapi';
import { SearchListItem } from '../ndbapi/classes';

interface CreatedState {
  ingredients: Ingredient[];
  recipes: Recipe[];
}

interface SearchState {
  searchString: string;
  dataSource: DataSource;
  items: SearchListItem[];
}

interface TrackingState {
  mealIdx?: number;
  ingredientId?: string;
}

enum Modals {
  NONE, TRACKING, INGREDIENT, RECIPE
}

// um could really do this with just the enum, do i need this whole class?
class ModalState {
  private openModal: Modals;

  constructor(openModal: Modals = Modals.NONE) {
    this.openModal = openModal;
  }

  openTrackingModal(): ModalState { return new ModalState(Modals.TRACKING); }

  openIngredientModal(): ModalState { return new ModalState(Modals.INGREDIENT); }

  openRecipeModal(): ModalState { return new ModalState(Modals.RECIPE); }

  close(): ModalState { return new ModalState(); }

  get tracking(): boolean { return this.openModal === Modals.TRACKING; }
  get ingredient(): boolean { return this.openModal === Modals.INGREDIENT; }
  get recipe(): boolean { return this.openModal === Modals.RECIPE; }
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
    ingredientId: undefined
  },
  today: [],
  created: {
    ingredients: [],
    recipes: []
  }
};
