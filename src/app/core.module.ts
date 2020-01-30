import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { ShoppingListService } from "./shopping-list/shopping-list.service";
import { RecipeService } from "./recipes/recipe.service";
import { RecipesResolverService } from "./recipes/recipes-resolver.service";
import { AuthInterceptorService } from "./auth/auth-interceptor.service";

@NgModule({
  providers: [
    ShoppingListService,
    RecipeService,
    RecipesResolverService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ]
})
export class CoreModule {}
