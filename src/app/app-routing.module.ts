import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
import { PublicProfileComponent } from './public-profile/public-profile.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: MainComponent
  },
  {
    path: 'chalange',
    loadChildren: () => import('./chalange/chalange.module').then(m => m.ChalangeModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'profile/:name',
    component: PublicProfileComponent
  },
  {
    path: 'profile',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
