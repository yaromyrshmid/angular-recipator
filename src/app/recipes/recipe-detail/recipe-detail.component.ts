import { Component, OnInit, OnDestroy } from "@angular/core";
import { Recipe } from "../recipe.model";
import { ActivatedRoute, Params, Router } from "@angular/router";

import { RecipeService } from "../recipe.service";
import { DataStorageService } from "src/app/shared/data-storage.service";
import { ShoppingListDataService } from "src/app/shopping-list/shopping-list-data.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-recipe-detail",
  templateUrl: "./recipe-detail.component.html",
  styleUrls: ["./recipe-detail.component.css"]
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  recipe: Recipe;
  id: string;
  loadingIngredients = false;
  loadedIngredients = false;

  private loadingSubscription: Subscription;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataStorageService,
    private slDataService: ShoppingListDataService
  ) {}

  ngOnInit() {
    // Getting recipe from service based on id from params
    this.route.params.subscribe((params: Params) => {
      this.id = params["id"];
      this.recipe = this.recipeService.getRecipe(this.id);
      // Reseting loaded ingredients on change
      this.loadedIngredients = false;
    });
    this.loadingSubscription = this.slDataService.finishedLoading.subscribe(
      (result: boolean) => {
        this.loadingIngredients = !result;
        this.loadedIngredients = result;
      }
    );
  }

  onAddToShoppingList() {
    this.slDataService.storeIngredients(this.recipe.ingredients);
  }

  onEditRecipe() {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    this.dataService.deleteRecipe(this.id);
    this.router.navigate(["/recipes"]);
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }
}
