import { NgModule } from "@angular/core";

import { AlertComponent } from "./alert/alert.component";
import { SpinnerComponent } from "./spinner/spinner.component";
import { DropdownDirective } from "./dropdown.directive";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [AlertComponent, SpinnerComponent, DropdownDirective],
  imports: [CommonModule],
  exports: [AlertComponent, SpinnerComponent, DropdownDirective, CommonModule]
})
export class SharedModule {}
