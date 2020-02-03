import { Component, OnInit, OnDestroy } from "@angular/core";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "./shopping-list.service";
import { Subscription } from "rxjs";
import { ShoppingListDataService } from "./shopping-list-data.service";

@Component({
  selector: "app-shopping-list",
  templateUrl: "./shopping-list.component.html",
  styleUrls: ["./shopping-list.component.css"]
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private igChangeSub: Subscription;
  private slErrorSub: Subscription;
  error: string = null;
  isLoading = false;

  constructor(
    private slService: ShoppingListService,
    private slDataService: ShoppingListDataService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    // Triggering fetch ingredients
    this.slDataService.fetchSL();
    // Getting ingredients from slService
    this.ingredients = this.slService.getIngredients();
    // Subscribing to change of ingredients
    this.igChangeSub = this.slService.ingredientsChanged.subscribe(
      (ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
        this.isLoading = false;
      }
    );
    // Subscrubing to errors of slDataService to d=isplay alert when error occures
    this.slErrorSub = this.slDataService.gotError.subscribe((error: string) => {
      this.error = error;
    });
  }

  onEditItem(index: number) {
    this.slService.startedEditing.next(index);
  }

  ngOnDestroy() {
    this.igChangeSub.unsubscribe();
    this.slErrorSub.unsubscribe();
  }

  onHandleError() {
    this.error = null;
    this.isLoading = false;
  }
}
