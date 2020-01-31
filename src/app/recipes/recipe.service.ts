import { Injectable } from "@angular/core";

import { Recipe } from "./recipe.model";
import { Subject } from "rxjs";

import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListDataService } from "../shopping-list/shopping-list-data.service";

@Injectable({ providedIn: "root" })
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];

  constructor() // private slDataService: ShoppingListDataService
  {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    // Informing on changed recipes
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(id: string) {
    // Returning recipe by id property
    return this.recipes.find(recipe => recipe.id === id);
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    // this.slDataService.storeIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(id: string, newRecipe) {
    // Finding by id the index of the element to replace
    const index: number = this.recipes.findIndex(recipe => {
      return recipe.id === id;
    });
    // Replacing element with new one at given index, passing the id as response doesn't have one
    this.recipes[index] = { ...newRecipe, id: id };
    // Returning the copy of a new array
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(id: string) {
    // Finding by id the index of the element to delete
    const index: number = this.recipes.findIndex(recipe => {
      return recipe.id === id;
    });
    // Deleting element
    this.recipes.splice(index, 1);
    // Returning the copy of a new array
    this.recipesChanged.next(this.recipes.slice());
  }
}
