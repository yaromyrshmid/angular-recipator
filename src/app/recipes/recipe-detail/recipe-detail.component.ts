import { Component, OnInit } from "@angular/core";
import { Recipe } from "../recipe.model";
import { ActivatedRoute, Params, Router } from "@angular/router";

import { RecipeService } from "../recipe.service";
import { DataStorageService } from "src/app/shared/data-storage.service";
import { ShoppingListDataService } from "src/app/shopping-list/shopping-list-data.service";

@Component({
  selector: "app-recipe-detail",
  templateUrl: "./recipe-detail.component.html",
  styleUrls: ["./recipe-detail.component.css"]
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: string;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataStorageService,
    private slDataService: ShoppingListDataService
  ) {}

  ngOnInit() {
    // Getting recipe from service based on idfrom params
    this.route.params.subscribe((params: Params) => {
      this.id = params["id"];
      console.log(this.recipeService.getRecipe(this.id));

      this.recipe = this.recipeService.getRecipe(this.id);
    });
  }

  onAddToShoppingList() {
    this.slDataService.storeIngredients(this.recipe.ingredients);
    // this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe() {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    this.dataService.deleteRecipe(this.id);
    this.router.navigate(["/recipes"]);
  }
}
