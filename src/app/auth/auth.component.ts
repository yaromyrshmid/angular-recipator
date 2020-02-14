import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Store } from "@ngrx/store";

import * as fromApp from "../store/reducers/app.reducer";
import * as AuthActions from "../store/actions/auth.actions";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"]
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.select("auth").subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoginMode) {
      this.store.dispatch(
        new AuthActions.LoginStart({ email: email, password: password })
      );
    } else {
      this.store.dispatch(
        new AuthActions.SignupStart({ email: email, password: password })
      );
    }
    form.reset();
  }

  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError());
  }
}
