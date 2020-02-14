import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "../actions/shopping-list.actions";

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientId: string;
  ingredientsError: string;
  loading: boolean;
}

const initialState: State = {
  ingredients: [],
  editedIngredient: null,
  editedIngredientId: null,
  ingredientsError: null,
  loading: false
};

export function shoppingListReducer(
  state: State = initialState,
  action: ShoppingListActions.ShoppingListActions
) {
  switch (action.type) {
    case ShoppingListActions.GET_INGREDIENTS_START:
      return {
        ...state,
        ingredientsError: null,
        loading: true
      };
    case ShoppingListActions.GET_INGREDIENTS_SUCCESS:
      return {
        ...state,
        ingredients: action.payload,
        loading: false
      };
    case ShoppingListActions.GET_INGREDIENTS_FAIL:
      return {
        ...state,
        ingredients: [],
        loading: false,
        ingredientsError: action.payload
      };
    case ShoppingListActions.UPDATE_INGREDIENT_START:
      return {
        ...state,
        ingredientsError: null,
        loading: true
      };
    case ShoppingListActions.UPDATE_INGREDIENT:
      const updatedIngrs = state.ingredients.map(ingr => {
        if (ingr.id === action.payload.id) {
          return action.payload;
        } else {
          return ingr;
        }
      });
      return {
        ...state,
        ingredients: updatedIngrs,
        loading: false,
        editedIngredientId: null,
        editedIngredient: null
      };
    case ShoppingListActions.UPDATE_INGREDIENT_FAIL:
      return {
        ...state,
        loading: false,
        ingredientsError: action.payload.message,
        editedIngredient: action.payload.formData
      };
    case ShoppingListActions.ADD_INGREDIENT_START:
      return {
        ...state,
        loading: true,
        ingredientsError: null
      };
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload],
        loading: false,
        editedIngredient: null,
        editedIngredientId: null
      };
    case ShoppingListActions.ADD_INGREDIENTS_START:
      return {
        ...state,
        loading: true
      };
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        loading: false,
        ingredients: [...state.ingredients, ...action.payload]
      };
    case ShoppingListActions.DELETE_INGREDIENT_START:
      return {
        ...state,
        loading: true
      };
    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        loading: false,
        ingredients: state.ingredients.filter(ingredient => {
          return ingredient.id !== action.payload;
        })
      };
    case ShoppingListActions.START_EDIT:
      return {
        ...state,
        ingredientsError: null,
        editedIngredientId: action.payload,
        editedIngredient: {
          ...state.ingredients.find((ingredient: Ingredient) => {
            return ingredient.id === action.payload;
          })
        }
      };
    case ShoppingListActions.STOP_EDIT:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientId: null
      };
    default:
      return state;
  }
}
