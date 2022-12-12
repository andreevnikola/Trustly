import { Component } from '@angular/core';
import { Form } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ChalangeService } from '../chalange.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent {

  description: string | undefined;
  file: File | undefined;
  files: File[] = [];
  activated: boolean = localStorage.getItem("activated") ? true : false;
  url: string | ArrayBuffer | null | undefined;
  parts: Array<number> = [0];
  loading: boolean = false;
  images: any = [];
  uploadData: any = {
    thumnail: "", 
    title: "",
    description: "",
    status: "планиран",
    steps: [
      {
        title: "",
        description: "",
        start: "",
        end: "",
        images: []
      }
    ]
  };

  constructor( private router: Router, private authService: AuthService, private chalangeService: ChalangeService ) { }

  descriptionChangedHandler(event: Event){
    this.description = (event.target as any).value
  }

  fileChoosen(event: any){
    this.file = event.target.files[0];
    this.files.push(event.target.files[0]);
    this.uploadData.thumnail = event.target.files[0].name;
    var reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);
		
		reader.onload = (_event) => {
			this.url = reader.result; 
		}
  }

  uploadImage(event: any, i: number){
    let reader = new FileReader();
    let indexForDelete = this.files.length;
    this.files.push(event.target.files[0]);
    this.uploadData.steps[i].images.push(event.target.files[0].name);
		reader.readAsDataURL(event.target.files[0]);
		
		reader.onload = (_event) => {
      if(!this.images[i]){
        this.images.push([])
      }
      let format;
      if(event.target.files[0].type.indexOf('image')> -1){
        format = 'image';
      } else if(event.target.files[0].type.indexOf('video')> -1){
        format = 'video';
      }
			this.images[i].push([reader.result, format, indexForDelete]); 
		}
  }

  uploadChalangeHandler(form: any){
    if(form.invalid){ return }
    if(this.uploadData.status === "планиран"){ this.uploadData.steps = [] }
    this.loading = true;
    this.chalangeService.uploadChalange(localStorage.getItem("name"), localStorage.getItem("key"), this.uploadData.title, this.uploadData.description, this.uploadData.thumnail, this.uploadData.status, this.uploadData.steps, this.files)?.subscribe({
      next: (value) => {
          this.loading = false;
          if(value.error){
            this.router.navigate(["/auth/login"]);
          }
          this.router.navigate(["/profile/"+localStorage.getItem("name")]);
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        alert("Нещо се обърка! Опитайте пак по-късно!");
      }
    });
  }

  confirmMail(){
    this.authService.activateMail(localStorage.getItem("mail"), localStorage.getItem("name")).subscribe({
      next: () => {
        this.router.navigate(["/auth/verify"]);
      },
      error: () => { alert("Нещо се обърка") }
    });
  }

  removeImageHandler(index: number, imagee: any){
    this.images[index].splice(this.images[index].indexOf(imagee), 1);
    this.files.splice(imagee[2], 1);
  }

}
