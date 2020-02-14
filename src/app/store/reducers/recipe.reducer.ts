import { Recipe } from "src/app/recipes/recipe.model";
import * as RecipesActions from "../actions/recipe.actions";

export interface State {
  recipes: Recipe[];
  loading: boolean;
  error: string;
}

const initialState: State = {
  recipes: [],
  loading: false,
  error: null
};

export function recipeReducer(
  state = initialState,
  action: RecipesActions.RecipesAction
) {
  switch (action.type) {
    case RecipesActions.GET_RECIPES_START:
      return {
        ...state,
        error: null,
        loading: true
      };
    case RecipesActions.GET_RECIPES:
      return {
        ...state,
        loading: false,
        recipes: [...action.payload]
      };
    case RecipesActions.ADD_RECIPE_START:
      return {
        ...state,
        loading: true
      };
    case RecipesActions.ADD_RECIPE:
      return {
        ...state,
        loading: false,
        recipes: [...state.recipes, action.payload]
      };
    case RecipesActions.UPDATE_RECIPE_START:
      return {
        ...state,
        loading: true
      };
    case RecipesActions.UPDATE_RECIPE:
      const newRecipes = state.recipes.map(recipe => {
        if (recipe.id === action.payload.id) {
          return action.payload;
        } else {
          return recipe;
        }
      });
      return {
        ...state,
        loading: false,
        recipes: newRecipes
      };
    case RecipesActions.DELETE_RECIPE_START:
      return {
        ...state,
        loading: true
      };
    case RecipesActions.DELETE_RECIPE:
      return {
        ...state,
        loading: false,
        recipes: state.recipes.filter(recipe => recipe.id !== action.payload)
      };
    case RecipesActions.RECIPE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
}
