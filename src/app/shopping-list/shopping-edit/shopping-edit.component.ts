import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Ingredient } from "src/app/shared/ingredient.model";
import { ShoppingListService } from "../shopping-list.service";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { ShoppingListDataService } from "../shopping-list-data.service";

@Component({
  selector: "app-shopping-edit",
  templateUrl: "./shopping-edit.component.html",
  styleUrls: ["./shopping-edit.component.css"]
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild("f", { static: false }) slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex;
  editedItem: Ingredient;

  constructor(
    private slService: ShoppingListService,
    private slDataService: ShoppingListDataService
  ) {}

  ngOnInit() {
    this.subscription = this.slService.startedEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedItem = this.slService.getIngredient(index);
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
    );
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
      this.slDataService.updateIngredient(this.editedItem.id, newIngredient);
    } else {
      // Putting to back-end
      this.slDataService.storeIngredient(newIngredient);
    }
    // Reseting form
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.slDataService.deleteIngredient(this.editedItem.id);
    this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
