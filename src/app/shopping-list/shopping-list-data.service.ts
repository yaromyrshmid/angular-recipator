import { Injectable } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { HttpClient } from "@angular/common/http";

import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "./shopping-list.service";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class ShoppingListDataService {
  userId = this.authService.user.value.id;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private slService: ShoppingListService
  ) {}

  fetchSL() {
    return this.http
      .get<Ingredient[]>(
        `https://angular-learn-fc6c0.firebaseio.com/shopping-list/${this.userId}.json`
      )
      .pipe(
        map(ingredients => {
          // Mapping object to array with ids from keys
          return Object.keys(ingredients).map((key: any) => {
            return {
              ...ingredients[key],
              id: key
            };
          });
        })
      )
      .subscribe(
        response => {
          // Setting ingredients in shopping-list service
          this.slService.setIngredients(response);
        },
        error => {
          console.log("error:", error);
        }
      );
  }

  storeIngredient(ingredient) {
    // Check if ingredient with the same name exists
    const ingredientExists = this.slService
      .getIngredients()
      .find(
        ingredientFromArray => ingredientFromArray.name === ingredient.name
      );
    // If exists - update this ingredient
    if (ingredientExists) {
      this.updateIngredient(ingredientExists.id, {
        name: ingredient.name,
        amount: ingredientExists.amount + ingredient.amount
      });
      // Else create new ingredient
    } else {
      return this.http
        .post(
          `https://angular-learn-fc6c0.firebaseio.com/shopping-list/${this.userId}.json`,
          ingredient
        )
        .subscribe(
          (response: { name: string }) => {
            // Adding ingredient to ingredient service
            this.slService.addIngredient({ ...ingredient, id: response.name });
          },
          error => {
            console.log("error:", error);
          }
        );
    }
  }

  updateIngredient(id: string, ingredient: { name: string; amount: number }) {
    return this.http
      .put(
        `https://angular-learn-fc6c0.firebaseio.com/shopping-list/${this.userId}/${id}.json`,
        ingredient
      )
      .subscribe(
        (response: { name: string; amount: number }) => {
          // Update ingredient in ingredient service
          this.slService.updateIngredient(id, response);
        },
        error => {
          console.log("error:", error);
        }
      );
  }

  deleteIngredient(id: string) {
    return this.http
      .delete(
        `https://angular-learn-fc6c0.firebaseio.com/shopping-list/${this.userId}/${id}.json`
      )
      .subscribe(
        response => {
          // Deleting ingredient in ingredient service
          this.slService.deleteIngredient(id);
        },
        error => {
          console.log("error:", error);
        }
      );
  }
}
