import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppEmailDirective } from './validators/email.directive';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppEmailDirective,
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    AppEmailDirective,
  ]
})
export class SharedModule { }
