import { Injectable } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { HttpClient } from "@angular/common/http";
import { Subscription, VirtualTimeScheduler } from "rxjs";

import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "./shopping-list.service";
import { map, tap } from "rxjs/operators";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ShoppingListDataService {
  finishedLoading = new Subject<boolean>();
  gotError = new Subject<string>();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private slService: ShoppingListService
  ) {}

  fetchSL() {
    return this.http
      .get<Ingredient[]>(
        `https://angular-learn-fc6c0.firebaseio.com/shopping-list/${this.authService.user.value.id}.json`
      )
      .pipe(
        map(ingredients => {
          if (ingredients) {
            // Mapping object to array with ids from keys
            return Object.keys(ingredients).map((key: any) => {
              return {
                ...ingredients[key],
                id: key
              };
            });
          } else {
            // Return empty array if user does not have a shopping list
            return [];
          }
        })
      )
      .subscribe(
        response => {
          // Setting ingredients in shopping-list service
          this.slService.setIngredients(response);
        },
        error => {
          this.gotError.next(
            error.message ? error.message : "Unknown error occured"
          );
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
          `https://angular-learn-fc6c0.firebaseio.com/shopping-list/${this.authService.user.value.id}.json`,
          ingredient
        )
        .subscribe(
          (response: { name: string }) => {
            // Adding ingredient to ingredient service
            this.slService.addIngredient({ ...ingredient, id: response.name });
          },
          error => {
            this.gotError.next(
              error.message ? error.message : "Unknown error occured"
            );
          }
        );
    }
  }

  storeIngredients(ingredientsToAdd) {
    this.finishedLoading.next(false);
    // Grabing ingredients from server, because they may not be initialized when recipes are loaded
    return this.http
      .get<Ingredient[]>(
        `https://angular-learn-fc6c0.firebaseio.com/shopping-list/${this.authService.user.value.id}.json`
      )
      .pipe(
        map(ingredients => {
          if (ingredients) {
            // Mapping object to array with ids from keys
            return Object.keys(ingredients).map((key: any) => {
              return {
                ...ingredients[key],
                id: key
              };
            });
          } else {
            // Return empty array if user does not have a shopping list
            return [];
          }
        })
      )
      .subscribe(
        response => {
          // Setting ingredients in shopping-list service
          this.slService.setIngredients(response);
          // Posting each ingredient
          ingredientsToAdd.forEach(ingredient => {
            this.storeIngredient(ingredient);
          });
          this.finishedLoading.next(true);
        },
        error => {
          this.gotError.next(
            error.message ? error.message : "Unknown error occured"
          );
        }
      );
  }

  updateIngredient(id: string, ingredient: { name: string; amount: number }) {
    return this.http
      .put(
        `https://angular-learn-fc6c0.firebaseio.com/shopping-list/${this.authService.user.value.id}/${id}.json`,
        ingredient
      )
      .subscribe(
        (response: { name: string; amount: number }) => {
          // Update ingredient in ingredient service
          this.slService.updateIngredient(id, response);
        },
        error => {
          this.gotError.next(
            error.message ? error.message : "Unknown error occured"
          );
        }
      );
  }

  deleteIngredient(id: string) {
    return this.http
      .delete(
        `https://angular-learn-fc6c0.firebaseio.com/shopping-list/${this.authService.user.value.id}/${id}.json`
      )
      .subscribe(
        response => {
          // Deleting ingredient in ingredient service
          this.slService.deleteIngredient(id);
        },
        error => {
          this.gotError.next(
            error.message ? error.message : "Unknown error occured"
          );
        }
      );
  }
}
