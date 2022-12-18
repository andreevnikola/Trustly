import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { ChalangesComponent } from '../chalange/chalanges/chalanges.component';
import { FollowedComponent } from './followed/followed.component';
import { NewComponent } from './new/new.component';
import { SearchComponent } from './search/search.component';
import { SpecificComponent } from './specific/specific.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: ChalangesComponent
    },
    {
        path: 'upload',
        component: NewComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'followed',
        canActivate: [AuthGuard],
        component: FollowedComponent
    },
    {
        path: 'detail/:id',
        component: SpecificComponent
    },
    {
        path: 'edit/:id',
        component: NewComponent
    },
    {
        path: 'search/:search',
        component: SearchComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChalangeRoutingModule { }
