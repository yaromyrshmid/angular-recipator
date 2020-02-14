import { Component, OnInit, OnDestroy } from "@angular/core";
import { Ingredient } from "../shared/ingredient.model";

import { Store } from "@ngrx/store";

import * as ShoppingListActions from "../store/actions/shopping-list.actions";
import * as fromApp from "../store/reducers/app.reducer";

@Component({
  selector: "app-shopping-list",
  templateUrl: "./shopping-list.component.html",
  styleUrls: ["./shopping-list.component.css"]
})
export class ShoppingListComponent implements OnInit {
  ingredients: Ingredient[];
  userId: string = null;
  error: string = null;
  isLoading = false;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.select("shoppingList").subscribe(slState => {
      this.ingredients = slState.ingredients;
      this.isLoading = slState.loading;
      this.error = slState.ingredientsError;
    });
    this.store.dispatch(new ShoppingListActions.GetIngredientsStart());
  }

  onEditItem(id: string) {
    this.store.dispatch(new ShoppingListActions.StartEdit(id));
  }

  onHandleError() {
    this.error = null;
    this.isLoading = false;
  }
}
