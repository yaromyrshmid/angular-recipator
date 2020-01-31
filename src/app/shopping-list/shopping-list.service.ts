import { Subject } from "rxjs";

import { Ingredient } from "../shared/ingredient.model";

export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  private ingredients: Ingredient[] = [];

  setIngredients(newIngredients) {
    // If user has ingredients creating new array of Ingredient instances
    if (newIngredients) {
      this.ingredients = newIngredients.map(ingredient => {
        return new Ingredient(
          ingredient.name,
          ingredient.amount,
          ingredient.id
        );
      });
    } else {
      // Setting empty array if user has no ingredients
      this.ingredients = [];
    }
    // Passing a copy of ingredients
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  addIngredient(ingredient) {
    this.ingredients.push(
      new Ingredient(ingredient.name, ingredient.amount, ingredient.id)
    );
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  updateIngredient(
    id: string,
    newIngredient: { name: string; amount: number }
  ) {
    // Finding by id the index of the element to replace
    const index: number = this.ingredients.findIndex(
      ingredient => ingredient.id === id
    );
    // Replacing element with new one at given index, passing the id as response doesn't have one
    this.ingredients[index] = { ...newIngredient, id: id };
    // Returning the copy of a new array
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  deleteIngredient(id: string) {
    // Finding by id the index of the element to delete
    const index: number = this.ingredients.findIndex(ingredient => {
      return ingredient.id === id;
    });
    // Deleting element
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
