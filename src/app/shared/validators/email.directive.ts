import { Directive, Input, HostListener, OnChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from "@angular/forms";
import { appEmailValidator } from './app-email-validator';

@Directive({
  selector: '[appEmail]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: AppEmailDirective,
      multi: true
    }
  ]
})
export class AppEmailDirective implements OnChanges, Validator{

  @Input() appEmail!: any;

  validator: ValidatorFn = () => null;
  
  constructor() {}
  @HostListener('change') ngOnChanges(): void {
    this.validator = appEmailValidator(this.appEmail) as any;
  }

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    return this.validator(control)
  }

}
