import { Action } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";

export const GET_INGREDIENTS_START = "GET_INGREDIENTS_START";
export const GET_INGREDIENTS_SUCCESS = "GET_INGREDIENTS_SUCCESS";
export const GET_INGREDIENTS_FAIL = "GET_INGREDIENTS_FAIL";
export const UPDATE_INGREDIENT_START = "UPDATE_INGREDIENT_START";
export const UPDATE_INGREDIENT = "UPDATE_INGREDIENT";
export const UPDATE_INGREDIENT_FAIL = "UPDATE_INGREDIENT_FAIL";
export const ADD_INGREDIENT_START = "ADD_INGREDIENT_START";
export const ADD_INGREDIENT = "ADD_INGREDIENT";
export const ADD_INGREDIENTS_START = "ADD_INGREDIENTS_START";
export const ADD_INGREDIENTS = "ADD_INGREDIENTS";
export const DELETE_INGREDIENT_START = "DELETE_INGREDIENT_START";
export const DELETE_INGREDIENT = "DELETE_INGREDIENT";
export const START_EDIT = "START_EDIT";
export const STOP_EDIT = "STOP_EDIT";

export class GetIngredientsStart implements Action {
  readonly type = GET_INGREDIENTS_START;
}

export class GetIngredientsSuccess implements Action {
  readonly type = GET_INGREDIENTS_SUCCESS;
  constructor(public payload: Ingredient[]) {}
}

export class GetIngredientsFail implements Action {
  readonly type = GET_INGREDIENTS_FAIL;
  constructor(public payload: string) {}
}

export class UpdateIngredientStart implements Action {
  readonly type = UPDATE_INGREDIENT_START;
  constructor(public payload: Ingredient) {}
}

export class UpdateIngredient implements Action {
  readonly type = UPDATE_INGREDIENT;

  constructor(public payload: Ingredient) {}
}

export class UpdateIngredientFail implements Action {
  readonly type = UPDATE_INGREDIENT_FAIL;

  constructor(
    public payload: {
      message: string;
      formData: { name: string; amount: number };
    }
  ) {}
}

export class AddIngredientStart implements Action {
  readonly type = ADD_INGREDIENT_START;
  constructor(
    public payload: { ingredient: { name: string; amount: number }; id: string }
  ) {}
}

export class AddIngredient implements Action {
  readonly type = ADD_INGREDIENT;
  constructor(public payload: Ingredient) {}
}

export class AddIngredientsStart implements Action {
  readonly type = ADD_INGREDIENTS_START;

  constructor(public payload: { name: string; amount: number }[]) {}
}

export class AddIngredients implements Action {
  readonly type = ADD_INGREDIENTS;

  constructor(public payload: Ingredient[]) {}
}

export class DeleteIngredientStart implements Action {
  readonly type = DELETE_INGREDIENT_START;

  constructor(public payload: string) {}
}

export class DeleteIngredient implements Action {
  readonly type = DELETE_INGREDIENT;

  constructor(public payload: string) {}
}

export class StartEdit implements Action {
  readonly type = START_EDIT;

  constructor(public payload: string) {}
}

export class StopEdit implements Action {
  readonly type = STOP_EDIT;
}

export type ShoppingListActions =
  | AddIngredient
  | AddIngredients
  | UpdateIngredient
  | DeleteIngredient
  | StartEdit
  | StopEdit
  | GetIngredientsStart
  | GetIngredientsSuccess
  | GetIngredientsFail
  | UpdateIngredientStart
  | UpdateIngredientFail
  | AddIngredientStart
  | DeleteIngredientStart
  | AddIngredientsStart;
