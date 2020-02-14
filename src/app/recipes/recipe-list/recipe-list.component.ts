import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";

import { Recipe } from "../recipe.model";
import { RecipeService } from "../recipe.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { DataStorageService } from "src/app/shared/data-storage.service";
import * as fromApp from "../../store/reducers/app.reducer";
import * as RecipesActions from "../../store/actions/recipe.actions";

@Component({
  selector: "app-recipe-list",
  templateUrl: "./recipe-list.component.html",
  styleUrls: ["./recipe-list.component.css"]
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[];
  subscription: Subscription;
  error: string = null;
  isLoading = false;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private dataStorageService: DataStorageService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.store.select("recipes").subscribe(recipesState => {
      this.recipes = recipesState.recipes;
      this.isLoading = recipesState.loading;
      this.error = recipesState.error;
    });
    this.store.dispatch(new RecipesActions.GetRecipesStart());
  }

  onNewRecipe() {
    this.router.navigate(["new"], { relativeTo: this.route });
  }

  onHandleError() {
    this.error = null;
    this.isLoading = false;
  }
}
