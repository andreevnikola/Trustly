import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { VerifyComponent } from './verify/verify.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'join',
    component: RegisterComponent
  },
  {
    path: 'verify',
    component: VerifyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/settings',
    canActivate: [AuthGuard],
    component: ProfileComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
