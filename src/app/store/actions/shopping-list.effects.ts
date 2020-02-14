import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { HttpClient } from "@angular/common/http";

import * as SlActions from "./shopping-list.actions";
import * as fromApp from "../reducers/app.reducer";
import { switchMap, map, catchError } from "rxjs/operators";
import { Ingredient } from "src/app/shared/ingredient.model";
import { Store } from "@ngrx/store";
import { of } from "rxjs";

@Injectable()
export class SlEffects {
  userId: string = null;

  @Effect()
  getShoppingList = this.actions$.pipe(
    ofType(SlActions.GET_INGREDIENTS_START),
    switchMap(() => {
      this.store
        .select("auth")
        .pipe(
          map(authState => {
            if (authState.user) {
              return authState.user.id;
            } else {
              return null;
            }
          })
        )
        .subscribe(id => {
          this.userId = id;
        });
      return this.http
        .get<Ingredient[]>(
          `https://angular-learn-fc6c0.firebaseio.com/shopping-list/${this.userId}.json`
        )
        .pipe(
          map(ingredients => {
            if (ingredients) {
              // Mapping object to array with ids from keys
              const ingredientArr = Object.keys(ingredients).map((key: any) => {
                return {
                  ...ingredients[key],
                  id: key
                };
              });
              return new SlActions.GetIngredientsSuccess(ingredientArr);
            } else {
              // Return empty array if user does not have a shopping list
              return new SlActions.GetIngredientsSuccess([]);
            }
          }),
          catchError((errorRes: any) => {
            return of(
              new SlActions.GetIngredientsFail("Failed to fetch ingredients")
            );
          })
        );
    })
  );

  @Effect()
  slUpdateIngredient = this.actions$.pipe(
    ofType(SlActions.UPDATE_INGREDIENT_START),
    switchMap((updateStart: SlActions.UpdateIngredientStart) => {
      const ingredientToSend = {
        name: updateStart.payload.name,
        amount: updateStart.payload.amount
      };
      return this.http
        .put(
          `https://angular-learn-fc6c0.firebaseio.com/shopping-list/${this.userId}/${updateStart.payload.id}.json`,
          ingredientToSend
        )
        .pipe(
          map((ingredient: { name: string; amount: number }) => {
            return new SlActions.UpdateIngredient({
              ...ingredient,
              id: updateStart.payload.id
            });
          }),
          catchError((errorRes: any) => {
            return of(
              new SlActions.UpdateIngredientFail({
                message: "Failed to update ingredients",
                formData: ingredientToSend
              })
            );
          })
        );
    })
  );

  @Effect()
  slAddIngredient = this.actions$.pipe(
    ofType(SlActions.ADD_INGREDIENT_START),
    switchMap((addIngrStart: SlActions.AddIngredientStart) => {
      // Check if ingredient has ID
      if (addIngrStart.payload.id) {
        // Create ingredient to update
        const ingredientToSend = {
          name: addIngrStart.payload.ingredient.name,
          amount: addIngrStart.payload.ingredient.amount
        };
        // Update on back end
        return this.http
          .put(
            `https://angular-learn-fc6c0.firebaseio.com/shopping-list/${this.userId}/${addIngrStart.payload.id}.json`,
            ingredientToSend
          )
          .pipe(
            // Dispatch update ingredient
            map((ingredient: { name: string; amount: number }) => {
              return new SlActions.UpdateIngredient({
                ...ingredient,
                id: addIngrStart.payload.id
              });
            }),
            // Dispatch update failed if failed
            catchError((errorRes: any) => {
              return of(
                new SlActions.UpdateIngredientFail({
                  message: "Failed to update ingredients",
                  formData: ingredientToSend
                })
              );
            })
          );
      } else {
        // Post to back end if ingredient is new
        return this.http
          .post(
            `https://angular-learn-fc6c0.firebaseio.com/shopping-list/${this.userId}.json`,
            addIngrStart.payload.ingredient
          )
          .pipe(
            // Dispatch add new ingredient
            map((res: { name: string }) => {
              return new SlActions.AddIngredient(
                new Ingredient(
                  addIngrStart.payload.ingredient.name,
                  addIngrStart.payload.ingredient.amount,
                  res.name
                )
              );
            }),
            // Dispatch update failed if failed
            catchError((errorRes: any) => {
              return of(
                new SlActions.UpdateIngredientFail({
                  message: "Failed to add ingredient",
                  formData: addIngrStart.payload.ingredient
                })
              );
            })
          );
      }
    })
  );

  @Effect()
  deleteIngredient = this.actions$.pipe(
    ofType(SlActions.DELETE_INGREDIENT_START),
    switchMap((deleteIngr: SlActions.DeleteIngredientStart) => {
      return this.http
        .delete(
          `https://angular-learn-fc6c0.firebaseio.com/shopping-list/${this.userId}/${deleteIngr.payload}.json`
        )
        .pipe(
          map(() => {
            return new SlActions.DeleteIngredient(deleteIngr.payload);
          }),
          // Dispatch delete failed if failed
          catchError((errorRes: any) => {
            return of(
              new SlActions.UpdateIngredientFail({
                message: "Failed to delete ingredient",
                formData: { name: null, amount: null }
              })
            );
          })
        );
    })
  );

  @Effect()
  addIngredients = this.actions$.pipe(
    ofType(SlActions.ADD_INGREDIENTS_START),
    switchMap((addIngrsStartAction: SlActions.AddIngredientsStart) => {
      let sl: Ingredient[] = [];
      this.store
        .select("shoppingList")
        .pipe(map(slStore => slStore.ingredients))
        .subscribe(data => (sl = [...data]));

      const ingrs = addIngrsStartAction.payload;

      ingrs.forEach(ingr => {
        const foundIngr = sl.find(
          (ingrInSl: Ingredient) => ingr.name === ingrInSl.name
        );
        if (foundIngr) {
          foundIngr.amount += ingr.amount;
        } else {
          sl.push(ingr);
        }
      });

      const slToSend = {};

      sl.forEach(ingr => {
        slToSend[
          Math.random()
            .toString(36)
            .substring(7)
        ] = { name: ingr.name, amount: ingr.amount };
      });

      return this.http
        .put(
          `https://angular-learn-fc6c0.firebaseio.com/shopping-list/${this.userId}.json`,
          slToSend
        )
        .pipe(
          map(ingredients => {
            if (ingredients) {
              // Mapping object to array with ids from keys
              const ingredientArr = Object.keys(ingredients).map((key: any) => {
                return {
                  ...ingredients[key],
                  id: key
                };
              });
              return new SlActions.GetIngredientsSuccess(ingredientArr);
            } else {
              // Return empty array if user does not have a shopping list
              return new SlActions.GetIngredientsSuccess([]);
            }
          }),
          catchError((errorRes: any) => {
            return of(
              new SlActions.GetIngredientsFail("Failed to fetch ingredients")
            );
          })
        );
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
