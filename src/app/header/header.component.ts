import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import { map } from "rxjs/operators";

import { DataStorageService } from "../shared/data-storage.service";
import * as fromApp from "../store/reducers/app.reducer";
import * as AuthActions from "../store/actions/auth.actions";
import * as RecipesActions from "../store/actions/recipe.actions";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html"
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.store
      .select("auth")
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.isAuthenticated = !!user;
      });
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.store.dispatch(new RecipesActions.GetRecipesStart());
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
