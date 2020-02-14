import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Actions, Effect, ofType } from "@ngrx/effects";

import * as RecipesActions from "./recipe.actions";
import { switchMap, map, catchError } from "rxjs/operators";
import { Recipe } from "src/app/recipes/recipe.model";
import { of } from "rxjs";
import { Ingredient } from "src/app/shared/ingredient.model";

@Injectable()
export class RecipesEffects {
  @Effect()
  getRecipes = this.actions$.pipe(
    ofType(RecipesActions.GET_RECIPES_START),
    switchMap(() => {
      return this.http
        .get<Recipe[]>(
          "https://angular-learn-fc6c0.firebaseio.com/recipes.json"
        )
        .pipe(
          map(recipes => {
            // Mapping object to array with ids from keys
            const RecipesArr: Recipe[] = Object.keys(recipes).map(
              (key: any) => {
                return {
                  ...recipes[key],
                  ingredients: recipes[key].ingredients
                    ? recipes[key].ingredients
                    : [],
                  id: key
                };
              }
            );
            return new RecipesActions.GetRecipes(RecipesArr);
          }),
          catchError((errorRes: any) => {
            return of(new RecipesActions.RecipeFail("Failed to fetch recipes"));
          })
        );
    })
  );

  @Effect()
  addRecipe = this.actions$.pipe(
    ofType(RecipesActions.ADD_RECIPE_START),
    switchMap((addStart: RecipesActions.AddRecipeStart) => {
      return this.http
        .post(
          "https://angular-learn-fc6c0.firebaseio.com/recipes.json",
          addStart.payload
        )
        .pipe(
          map((response: { name: string }) => {
            // Dispatching add recipe
            return new RecipesActions.AddRecipe({
              ...addStart.payload,
              id: response.name
            });
          }),
          catchError((errorRes: any) => {
            return of(new RecipesActions.RecipeFail("Failed to add recipe"));
          })
        );
    })
  );

  @Effect()
  updateRecipe = this.actions$.pipe(
    ofType(RecipesActions.UPDATE_RECIPE_START),
    switchMap((updateStart: RecipesActions.UpdateRecipeStart) => {
      return this.http
        .put(
          `https://angular-learn-fc6c0.firebaseio.com/recipes/${updateStart.payload.id}.json`,
          updateStart.payload.updatedRecipe
        )
        .pipe(
          map(
            (response: {
              description: string;
              imagePath: string;
              ingredients: Ingredient[];
              name: string;
            }) => {
              return new RecipesActions.UpdateRecipe({
                ...response,
                id: updateStart.payload.id
              });
            }
          ),
          catchError((errorRes: any) => {
            return of(new RecipesActions.RecipeFail("Failed to update recipe"));
          })
        );
    })
  );

  @Effect()
  deleteRecipe = this.actions$.pipe(
    ofType(RecipesActions.DELETE_RECIPE_START),
    switchMap((deleteStart: RecipesActions.DeleteRecipeStart) => {
      return this.http
        .delete(
          `https://angular-learn-fc6c0.firebaseio.com/recipes/${deleteStart.payload}.json`
        )
        .pipe(
          map(() => {
            return new RecipesActions.DeleteRecipe(deleteStart.payload);
          }),
          catchError((errorRes: any) => {
            return of(new RecipesActions.RecipeFail("Failed to delete recipe"));
          })
        );
    })
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
