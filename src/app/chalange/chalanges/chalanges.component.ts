import { Component, OnInit } from '@angular/core';
import { ChalangeService } from '../chalange.service';

@Component({
  selector: 'app-chalanges',
  templateUrl: './chalanges.component.html',
  styleUrls: ['./chalanges.component.scss']
})
export class ChalangesComponent {

  loading: boolean = true;
  data: any;
  creators: any;

  constructor(private chalangeService: ChalangeService) {
    this.chalangeService.getChalanges().subscribe({
      next: (value: any) => {
        this.loading = false;
        this.data = value.data;
        this.creators = value.creators;
      },
      error: (err) => {
        console.log(err)
        this.loading = false;
      }
    });
  }

}
