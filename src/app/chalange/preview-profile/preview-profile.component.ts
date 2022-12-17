import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preview-profile',
  templateUrl: './preview-profile.component.html',
  styleUrls: ['./preview-profile.component.scss']
})
export class PreviewProfileComponent {

  @Input() user: any;

  constructor(private router: Router) { }

  openProfileHandler(){
    this.router.navigate(['/profile/' + this.user.name]);
  }

}
