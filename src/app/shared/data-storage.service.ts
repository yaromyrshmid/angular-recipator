import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, tap } from "rxjs/operators";

import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";

@Injectable({ providedIn: "root" })
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put("https://angular-learn-fc6c0.firebaseio.com/recipes.json", recipes)
      .subscribe(response => {
        console.log(response);
      });
  }

  storeRecipe(recipe) {
    return this.http
      .post("https://angular-learn-fc6c0.firebaseio.com/recipes.json", recipe)
      .subscribe(
        (response: { name: string }) => {
          // Adding recipe to recipe service
          this.recipeService.addRecipe({ ...recipe, id: response.name });
        },
        error => {
          console.log("error:", error);
        }
      );
  }

  updateRecipe(id: string, recipe) {
    return this.http
      .put(
        `https://angular-learn-fc6c0.firebaseio.com/recipes/${id}.json`,
        recipe
      )
      .subscribe(
        response => {
          // Updating recipe in recipe service
          this.recipeService.updateRecipe(id, response);
        },
        error => {
          console.log("error:", error);
        }
      );
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>("https://angular-learn-fc6c0.firebaseio.com/recipes.json")
      .pipe(
        map(recipes => {
          // Mapping object to array with ids from keys
          return Object.keys(recipes).map((key: any) => {
            return {
              ...recipes[key],
              ingredients: recipes[key].ingredients
                ? recipes[key].ingredients
                : [],
              id: key
            };
          });
        }),
        // Saving to recipes array in service
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }

  deleteRecipe(id: string) {
    return this.http
      .delete(`https://angular-learn-fc6c0.firebaseio.com/recipes/${id}.json`)
      .subscribe(
        response => {
          // Updating recipe in recipe service
          this.recipeService.deleteRecipe(id);
        },
        error => {
          console.log("error:", error);
        }
      );
  }
}
