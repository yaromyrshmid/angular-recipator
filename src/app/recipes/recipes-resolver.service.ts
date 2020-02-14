import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";

import { Recipe } from "./recipe.model";
import { Store } from "@ngrx/store";
import * as fromApp from "../store/reducers/app.reducer";
import * as RecipesActions from "../store/actions/recipe.actions";
import { take, map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class RecipesResolverService implements Resolve<Recipe[]> {
  recipes: Recipe[] = [];

  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.store
      .select("recipes")
      .pipe(
        map(recipesState => {
          return recipesState.recipes;
        })
      )
      .subscribe(recipes => (this.recipes = recipes));

    if (this.recipes.length === 0) {
      this.store.dispatch(new RecipesActions.GetRecipesStart());
      return this.actions$.pipe(ofType(RecipesActions.GET_RECIPES), take(1));
    } else {
      return this.recipes;
    }
  }
}
