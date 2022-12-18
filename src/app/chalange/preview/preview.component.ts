import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ChalangeService } from '../chalange.service';

@Component({
  selector: 'app-preview-chalange',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent {

  @Input() chalange: any;
  @Input() creator?: any;
  @Input() showName?: any = true;
  myUserName: string | null = localStorage.getItem("name");
  isDeleting: boolean = false;

  constructor( private router: Router, private chalangeService: ChalangeService ) { }

  maximizeChalangeHandler(){
    if(this.isDeleting){ return }
    this.router.navigate(['/challenge/detail/' + this.chalange._id]);
  }

  deleteChalangeHandler(){
    if(!localStorage.getItem("key")){ return }
    this.isDeleting = true;
    this.chalangeService.deleteChalange(this.chalange._id).subscribe({
      next: (value) => {
        if(value.error){
          alert(value.error);
          return;
        }
        this.chalange = false;
      },
      error: (err) => {
        alert("Неяо се обурка! Опитайте пак по-късно!");
        console.log(err)
      }
    });
  }

}
