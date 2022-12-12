import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preview-chalange',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent {

  @Input() chalange: any;
  @Input() creator?: any;

  constructor( private router: Router ) { }

  maximizeChalangeHandler(){
    this.router.navigate(['/chalange/' + this.chalange._id]);
  }

}
