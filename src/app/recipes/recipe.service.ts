import { EventEmitter, Injectable } from "@angular/core";

import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";

@Injectable()
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe(
      "Olivie",
      "Good olivieshechka",
      "https://live.staticflickr.com/65535/48130513301_9675d15919_b.jpg",
      [new Ingredient("Kovbaska", 10), new Ingredient("Kartopelka", 15)]
    ),
    new Recipe(
      "Cezar",
      "Good salat",
      "https://www.inspiredtaste.net/wp-content/uploads/2012/12/Caesar-Salad-Recipe-1200.jpg",
      [new Ingredient("Aisberg", 10), new Ingredient("Chicken", 15)]
    )
  ];

  constructor(private slService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }
}
