import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewComponent } from './new/new.component';
import { FollowedComponent } from './followed/followed.component';
import { ChalangeRoutingModule } from './routing.module';
import { MarkdownModule } from 'ngx-markdown';
import { FormsModule } from '@angular/forms';
import { PreviewComponent } from './preview/preview.component';
import { SpecificComponent } from './specific/specific.component';
import { ChalangesComponent } from './chalanges/chalanges.component';
import { SearchComponent } from './search/search.component';
import { PreviewProfileComponent } from './preview-profile/preview-profile.component';



@NgModule({
  declarations: [
    NewComponent,
    FollowedComponent,
    PreviewComponent,
    SpecificComponent,
    ChalangesComponent,
    SearchComponent,
    PreviewProfileComponent
  ],
  imports: [
    CommonModule,
    ChalangeRoutingModule,
    MarkdownModule.forRoot(),
    FormsModule,
  ],
  exports: [
    PreviewComponent,
    ChalangesComponent
  ]
})
export class ChalangeModule { }
