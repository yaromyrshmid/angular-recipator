import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { FormGroup, FormControl, FormArray, Validators } from "@angular/forms";

import * as fromApp from "../../store/reducers/app.reducer";
import * as RecipesActions from "../../store/actions/recipe.actions";
import { map } from "rxjs/operators";

@Component({
  selector: "app-recipe-edit",
  templateUrl: "./recipe-edit.component.html",
  styleUrls: ["./recipe-edit.component.css"]
})
export class RecipeEditComponent implements OnInit {
  id: string;
  editMode = false;
  recipeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params["id"];
      this.editMode = params["id"] != null;
      this.initForm();
    });
  }

  onSubmit() {
    if (this.editMode) {
      this.store.dispatch(
        new RecipesActions.UpdateRecipeStart({
          updatedRecipe: this.recipeForm.value,
          id: this.id
        })
      );
    } else {
      this.store.dispatch(
        new RecipesActions.AddRecipeStart(this.recipeForm.value)
      );
    }
    this.onCancel();
  }

  private initForm() {
    let recipeName = "";
    let recipeImagePath = "";
    let recipeDescription = "";
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      // const recipe = this.recipeService.getRecipe(this.id);
      this.store
        .select("recipes")
        .pipe(
          map(recipesState => {
            return recipesState.recipes.find(recipe => recipe.id === this.id);
          })
        )
        .subscribe(recipe => {
          recipeName = recipe.name;
          recipeImagePath = recipe.imagePath;
          recipeDescription = recipe.description;
          if (recipe["ingredients"]) {
            for (let ingredient of recipe.ingredients) {
              recipeIngredients.push(
                new FormGroup({
                  name: new FormControl(ingredient.name, Validators.required),
                  amount: new FormControl(ingredient.amount, [
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/)
                  ])
                })
              );
            }
          }
        });
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients
    });
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get("ingredients")).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    );
  }

  onCancel() {
    this.router.navigate(["../"], { relativeTo: this.route });
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get("ingredients")).removeAt(index);
  }

  get controls() {
    // a getter!
    return (this.recipeForm.get("ingredients") as FormArray).controls;
  }
}
