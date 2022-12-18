import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FollowedComponent } from './followed/followed.component';
import { NewComponent } from './new/new.component';
import { SearchComponent } from './search/search.component';
import { SpecificComponent } from './specific/specific.component';
import { ChalangeModule } from '../chalange/chalange.module';
import { ChalangeRoutingModule } from './routing.module';
import { MarkdownModule } from 'ngx-markdown';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    FollowedComponent,
    NewComponent,
    SearchComponent,
    SpecificComponent
  ],
  imports: [
    ChalangeModule,
    CommonModule,
    MarkdownModule,
    ChalangeRoutingModule,
    MarkdownModule.forRoot(),
    FormsModule
  ]
})
export class LazyChallengeModule { }
