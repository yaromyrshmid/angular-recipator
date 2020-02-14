import { Component, OnInit, OnDestroy } from "@angular/core";
import { Recipe } from "../recipe.model";
import { ActivatedRoute, Params, Router } from "@angular/router";

import { Store } from "@ngrx/store";
import * as ShoppingListActions from "../../store/actions/shopping-list.actions";
import * as RecipesActions from "../../store/actions/recipe.actions";
import * as fromApp from "../../store/reducers/app.reducer";
import { map } from "rxjs/operators";

@Component({
  selector: "app-recipe-detail",
  templateUrl: "./recipe-detail.component.html",
  styleUrls: ["./recipe-detail.component.css"]
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: string;
  loadingIngredients = false;
  loadedIngredients = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params["id"];
      this.store
        .select("recipes")
        .pipe(
          map(recipesState => {
            return recipesState.recipes.find(recipe => recipe.id === this.id);
          })
        )
        .subscribe(recipe => {
          this.recipe = recipe;
          this.loadedIngredients = false;
        });
    });
  }

  onAddToShoppingList() {
    this.store.dispatch(
      new ShoppingListActions.AddIngredientsStart(this.recipe.ingredients)
    );
    this.loadedIngredients = true;
  }

  onEditRecipe() {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    this.store.dispatch(new RecipesActions.DeleteRecipeStart(this.id));
    this.router.navigate(["/recipes"]);
  }
}
