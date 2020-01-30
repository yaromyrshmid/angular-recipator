import { NgModule } from "@angular/core";

import { AlertComponent } from "./alert/alert.component";
import { SpinnerComponent } from "./spinner/spinner.component";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [AlertComponent, SpinnerComponent],
  imports: [CommonModule],
  exports: [AlertComponent, SpinnerComponent, CommonModule]
})
export class SharedModule {}
