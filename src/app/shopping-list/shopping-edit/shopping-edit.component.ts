import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Ingredient } from "src/app/shared/ingredient.model";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import * as ShoppingListActions from "../../store/actions/shopping-list.actions";
import * as fromApp from "../../store/reducers/app.reducer";

@Component({
  selector: "app-shopping-edit",
  templateUrl: "./shopping-edit.component.html",
  styleUrls: ["./shopping-edit.component.css"]
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild("f", { static: true }) slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItem: Ingredient;
  allIngredients: Ingredient[];

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.select("shoppingList").subscribe(stateData => {
      this.allIngredients = stateData.ingredients;
      if (stateData.editedIngredientId) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      } else {
        this.editMode = false;
      }
    });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    // Creating new object to send to back-end
    const newIngredient = {
      name: value.name,
      amount: value.amount
    };
    if (this.editMode) {
      // Posting to back-end
      this.store.dispatch(
        new ShoppingListActions.UpdateIngredientStart({
          id: this.editedItem.id,
          name: newIngredient.name,
          amount: newIngredient.amount
        })
      );
    } else {
      // Check if ingr with such name exists
      const ingr = this.allIngredients.find(ingr => {
        return ingr.name === value.name;
      });
      let ingrId: string;
      if (ingr) {
        ingrId = ingr.id;
        newIngredient.amount += ingr.amount;
      } else {
        ingrId = null;
      }

      // Putting to back-end
      this.store.dispatch(
        new ShoppingListActions.AddIngredientStart({
          ingredient: newIngredient,
          id: ingrId
        })
      );
    }
    // Reseting form
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
    this.store.dispatch(
      new ShoppingListActions.DeleteIngredientStart(this.editedItem.id)
    );
    this.onClear();
  }
}
