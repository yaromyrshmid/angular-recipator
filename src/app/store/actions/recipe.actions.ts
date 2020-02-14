import { Action } from "@ngrx/store";

import { Recipe } from "src/app/recipes/recipe.model";
import { Ingredient } from "src/app/shared/ingredient.model";

export const GET_RECIPES_START = "GET_RECIPES_START";
export const GET_RECIPES = "GET_RECIPES";
export const ADD_RECIPE_START = "ADD_RECIPE_START";
export const ADD_RECIPE = "ADD_RECIPE";
export const UPDATE_RECIPE_START = "UPDATE_RECIPE_START";
export const UPDATE_RECIPE = "UPDATE_RECIPE";
export const DELETE_RECIPE_START = "DELETE_RECIPE_START";
export const DELETE_RECIPE = "DELETE_RECIPE";
export const RECIPE_FAIL = "RECIPE_FAIL";

export class GetRecipesStart implements Action {
  readonly type = GET_RECIPES_START;

  constructor() {}
}

export class GetRecipes implements Action {
  readonly type = GET_RECIPES;

  constructor(public payload: Recipe[]) {}
}

export class AddRecipeStart implements Action {
  readonly type = ADD_RECIPE_START;

  constructor(public payload: Recipe) {}
}

export class AddRecipe implements Action {
  readonly type = ADD_RECIPE;

  constructor(public payload: Recipe) {}
}

export class UpdateRecipeStart implements Action {
  readonly type = UPDATE_RECIPE_START;

  constructor(
    public payload: {
      updatedRecipe: {
        name: string;
        imagePath: string;
        description: string;
        ingredients: Ingredient[];
      };
      id: string;
    }
  ) {}
}

export class UpdateRecipe implements Action {
  readonly type = UPDATE_RECIPE;

  constructor(public payload: Recipe) {}
}

export class DeleteRecipeStart implements Action {
  readonly type = DELETE_RECIPE_START;

  constructor(public payload: string) {}
}

export class DeleteRecipe implements Action {
  readonly type = DELETE_RECIPE;

  constructor(public payload: string) {}
}

export class RecipeFail implements Action {
  readonly type = RECIPE_FAIL;

  constructor(public payload: string) {}
}

export type RecipesAction =
  | AddRecipeStart
  | AddRecipe
  | RecipeFail
  | GetRecipes
  | GetRecipesStart
  | UpdateRecipeStart
  | UpdateRecipe
  | DeleteRecipeStart
  | DeleteRecipe;
