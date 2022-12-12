import { AbstractControl, ValidatorFn } from '@angular/forms';

export const appEmailValidator: ValidatorFn = () => {
    return (control: AbstractControl<any, any>) => {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(control.value) ? null : { appEmailValidator: true }
    }
}