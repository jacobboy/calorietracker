import { NamedMacros, Recipe, AmountOfNamedMacros, Meal } from './client';
import { macrosFromFoods } from './transforms';

/* function ingredientId() { return getIngredientKey(uuid.v4()); }
function ndbnoId(ndbno: string) { return getNdbKey(ndbno); }
function amountOfId() { return getAmountOfKey(uuid.v4()); }
function recipeId() { return getRecipeKey(uuid.v4()); }
function mealId() { return getMealKey(uuid.v4()); }
function dateId(date: string) { return getDateKey(date); } */

export enum FOOD_UNIT {
  'g' = 'g',
  'ml' = 'ml'
}

export interface Named { readonly name: string; }

/* export interface Quantifiable extends Named {
  readonly amount: number;
  readonly unit: string;
}
 */
/* export interface Ingredient extends Nutritional, Quantifiable, UIDed { } */

/* export interface AmountOf<T extends Ingredient> extends Ingredient {
  baseFood: T;
  scaleTo(amount: number): AmountOf<T>;
} */

/* class ScalableIngredientImpl<T extends Ingredient> extends AbstractNutritional implements AmountOf<T> {
  static new<U extends Ingredient>(baseFood: U, amount: number) {
    return new ScalableIngredientImpl(amountOfId(), baseFood, amount);
  }

  static fromObj<U extends Ingredient>(obj: AmountOf<U>) {
    return new ScalableIngredientImpl(obj.uid, obj.baseFood, obj.amount);
  }

  protected constructor(
    readonly uid: string,
    readonly baseFood: T,
    readonly amount: number,
  ) { super(); }

  get name() { return this.baseFood.name; }
  get fat() { return scaleQuantity(this.baseFood.fat, this.baseFood.amount, this.amount); }
  get carbs() { return scaleQuantity(this.baseFood.carbs, this.baseFood.amount, this.amount); }
  get protein() { return scaleQuantity(this.baseFood.protein, this.baseFood.amount, this.amount); }
  get calories() { return scaleQuantity(this.baseFood.calories, this.baseFood.amount, this.amount); }
  get unit() { return this.baseFood.unit; }

  scaleTo(amount: number): AmountOf<T> {
    return ScalableIngredientImpl.new(this.baseFood, amount);
  }
} */

/* export interface Recipe extends Ingredient { readonly foods: AmountOfNamedMacros[]; }

export interface FoodCombo extends Nutritional {
  readonly foods: Ingredient[];
  withFood(Ingredient: Ingredient): FoodCombo;
  withoutFood(Ingredient: Ingredient): FoodCombo;
}

export interface Meal extends client.Meal {
  withFood(food: AmountOfNamedMacros): Meal;
  withoutFood(food: AmountOfNamedMacros): Meal;
} */

/* abstract class AbstractMacrosFromFoods extends AbstractNutritional {
  readonly foods: AmountOfNamedMacros[];

  constructor(foods: AmountOfNamedMacros[]) {
    super();
    this.foods = foods;
  }

  get calories() {
    return this.foods.reduce(
        (l, r) => l + scaleQuantity(r.namedMacros.calories, r.namedMacros.amount, r.amount), 0
    );
  }
  get protein() {
    return this.foods.reduce(
        (l, r) => l + scaleQuantity(r.namedMacros.protein, r.namedMacros.amount, r.amount), 0
    );
  }
  get fat() {
    return this.foods.reduce(
        (l, r) => l + scaleQuantity(r.namedMacros.fat, r.namedMacros.amount, r.amount), 0
    );
  }
  get carbs() {
    return this.foods.reduce(
        (l, r) => l + scaleQuantity(r.namedMacros.carbs, r.namedMacros.amount, r.amount), 0
    );
  }
 } */

/* class MealImpl extends AbstractMacrosFromFoods implements Meal {
  readonly uid: string;

  constructor(foods: AmountOfNamedMacros[]) {
    super(foods);
    this.uid = mealId();
  }

  withFood(food: AmountOfNamedMacros): Meal {
    return new MealImpl([...this.foods, food]);
  }
  withoutFood(food: AmountOfNamedMacros): Meal {
    if (this.foods.find((f) => f === food) !== undefined) {
      return new MealImpl(this.foods.filter(f => f !== food));
    } else {
      throw new Error(`Food not found: ${JSON.stringify(food)} in ${this.foods.map(f => f.uid)}`);
    }
  }
} */

/* class RecipeImpl extends AbstractNutritional implements Ingredient, Recipe {

  static new(name: string, foods: AmountOfNamedMacros[], portionAmount: number, totalAmount?: number, unit?: string) {
    if (unit === undefined) {
      const units = new Set(foods.map(f => f.unit));
      if (units.size !== 1) {
        // TODO propery way to handle this?
        throw `Food units must be the same if unit not provided, found ${Array.from(units).join(', ')}`;
      }
      unit = foods[0].unit;
    }
    if (totalAmount === undefined) {
      totalAmount = foods.reduce((l, r) => l + r.amount, 0);
    }

    const calories = foods.reduce((l, r) => l + r.calories, 0);
    const protein = foods.reduce((l, r) => l + r.protein, 0);
    const fat = foods.reduce((l, r) => l + r.fat, 0);
    const carbs = foods.reduce((l, r) => l + r.carbs, 0);

    const uid = recipeId();
    return new RecipeImpl(
      uid, name, foods, fat, carbs, protein,
      calories, portionAmount, totalAmount, unit
    );
  }

  static fromObject(recipe: RecipeImpl) {
      return new RecipeImpl(
        recipe.uid, recipe.name, recipe.foods, recipe.totalFat, recipe.totalCarbs,
        recipe.totalProtein, recipe.totalCalories, recipe.portionAmount, recipe.totalAmount,
        recipe.unit
      );
    }

  private constructor(
    readonly uid: string,
    readonly name: string,
    readonly foods: AmountOfNamedMacros[],
    readonly totalFat: number,
    readonly totalCarbs: number,
    readonly totalProtein: number,
    readonly totalCalories: number,
    readonly portionAmount: number,
    readonly totalAmount: number,
    readonly unit: string,
  ) { super(); }

  get fat() { return scaleQuantity(this.totalFat, this.totalAmount, this.portionAmount); }
  get carbs() { return scaleQuantity(this.totalCarbs, this.totalAmount, this.portionAmount); }
  get protein() { return scaleQuantity(this.totalProtein, this.totalAmount, this.portionAmount); }
  get calories() { return scaleQuantity(this.totalCalories, this.totalAmount, this.portionAmount); }
  get amount() { return this.portionAmount; }
} */

/* export class MealDate {
  private readonly year: number;
  private readonly month: number;
  private readonly day: number;

  static today() {
    return new MealDate(new Date());
  }

  constructor(date: Date) {
    this.year = date.getUTCFullYear();
    this.month = date.getUTCMonth();
    this.day = date.getUTCDay();
   }

   get id() {
     return getDateKey(`${this.year}_${this.month}_${this.day}`);
   }
} */

/* export function ingredientFromJson(jsonStr: string): AmountOfNamedMacros {
  const baseIngred = CustomIngredient.fromJson(jsonStr);
  return ScalableIngredientImpl.new(baseIngred, baseIngred.amount);
} */

/* export function scaleFoodTo<T extends Ingredient>(
  ingredient: AmountOf<T>, amount: number
): AmountOf<T> {
  return ingredient.scaleTo(amount);
} */

/* export function amountOf(ingredient: Ingredient, amount?: number) {
  amount = amount || ingredient.amount;
  // TODO uhhh this is double plus bad, fix this
  if (ingredient instanceof ScalableIngredientImpl) {
    return scaleFoodTo(ingredient, amount);
  } else {
    return ScalableIngredientImpl.new(ingredient, amount);
  }
} */

/* export function makeScaledIngredient(
  name: string,
  fat: number,
  carbs: number,
  protein: number,
  calories: number,
  amount: number,
  convertAmount: number,
  unit: string
): NewIngredient {
  const [sFat, sCarbs, sProtein, sCalories] = [fat, carbs, protein, calories].map(
    (m) => scaleQuantity(m, amount, convertAmount)
  );
  const ingred = {
    fat: sFat,
    carbs: sCarbs,
    protein: sProtein,
    calories: sCalories,
    amount: convertAmount,
    name,
    unit
  };
  return ingred;
} */

// TODO move these test helpers, where do test helpers go in a JS app?
export function makeTestAmountOfNamedMacros(
  name: string,
  fat: number,
  carbs: number,
  protein: number,
  calories: number,
  amount: number,
  unit: string
): AmountOfNamedMacros {
  return {
    amount: amount,
    namedMacros: {
      uid: `${name}_uid`, name, protein, fat, carbs, calories, amount, unit
    }
  };
}
export function makeTestNamedMacros(
  name: string,
  fat: number,
  carbs: number,
  protein: number,
  calories: number,
  amount: number,
  unit: string
): NamedMacros {
  return {
    uid: `${name}_uid`, name, protein, fat, carbs, calories, amount, unit
  };
}

export function makeTestRecipe(
  name: string, foods: AmountOfNamedMacros[], portionSize: number, totalSize?: number, unit?: string
): Recipe {
  const macros = macrosFromFoods(foods);
  return {
    uid: `${name}_uid`,
    name,
    foods,
    portionSize,
    amount: totalSize || foods.reduce((amt, food) => amt + food.amount, 0),
    unit: unit || foods[0].namedMacros.unit,
    protein: macros.protein,
    fat: macros.fat,
    carbs: macros.carbs,
    calories: macros.calories
  };
}

export function makeTestMeal(uid: string, foods: AmountOfNamedMacros[]): Meal {
  return { uid, foods };
}

/* // tslint:disable-next-line:no-any
function amountOfFromObj(amountOfObj: any): AmountOfNamedMacros {
  let baseFood: Ingredient;
  if (amountOfObj.baseFood.ndbno !== undefined) {
    baseFood = NDBIngredient.fromObj(amountOfObj.baseFood);
  } else {
    baseFood = CustomIngredient.fromJson(JSON.stringify(amountOfObj.baseFood));
  }
  return ScalableIngredientImpl.fromObj({...amountOfObj, baseFood});
}

export function recipeFromJson (jsonStr: string): Recipe {
  let recipe = JSON.parse(jsonStr);
  const foods = recipe.foods.map(amountOfFromObj);
  return RecipeImpl.fromObject({...recipe, foods});
} */

/* export function meal(foods: AmountOfNamedMacros[]): Meal {
  return new MealImpl(foods);
} */
