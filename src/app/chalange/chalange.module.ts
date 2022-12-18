import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { PreviewComponent } from './preview/preview.component';
import { ChalangesComponent } from './chalanges/chalanges.component';
import { PreviewProfileComponent } from './preview-profile/preview-profile.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    PreviewComponent,
    PreviewProfileComponent,
    ChalangesComponent,
  ],
  imports: [
    CommonModule,
    MarkdownModule.forRoot(),
    RouterModule
  ],
  exports: [
    PreviewComponent,
    ChalangesComponent
  ]
})
export class ChalangeModule { }
