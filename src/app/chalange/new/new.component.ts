import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  id: string | undefined | null;
  forDelete: any[] = [];
  thumnailBeforeChange: string | ArrayBuffer | null | undefined;
  stepsImages: string[] = [];

  constructor( private router: Router, private authService: AuthService, private chalangeService: ChalangeService, private route: ActivatedRoute ) {
    this.id = this.route.snapshot.paramMap.get('id') || null;
    if(this.id){
      this.loading = true;
      this.chalangeService.getChalangeById(this.id, localStorage.getItem("key")).subscribe({
        next: (value) => {
          this.loading = false;
          if(value.creator.name !== localStorage.getItem("name")){
            router.navigate(['/']);
            return;
          }
          this.url = value.chalange.thumnail || null;
          this.thumnailBeforeChange = this.url;
          if(!value.chalange.steps){
            this.uploadData = {
              thumnail: value.chalange.thumnail || "", 
              title: value.chalange.title,
              description: value.chalange.description,
              status: value.chalange.status,
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
            return
          }
          this.uploadData = {
            thumnail: value.chalange.thumnail || "", 
            title: value.chalange.title,
            description: value.chalange.description,
            status: value.chalange.status,
            steps: []
          };
          this.parts = [];
          value.chalange.steps?.map((step: any, i: number) => {
            this.images.push([]);
            step.images?.map((img: any) => {
              this.stepsImages.push(img);
              this.images[i].push(img);
            });
            this.uploadData.steps.push({
              title: step.title,
              description: step.description,
              start: step.start,
              end: step.end
            });
            this.parts.push(i);
          });
          console.log(value.chalange.steps)
        },
        error: (err) => {
          this.loading = false;
          console.log(err)
          alert("Нещо се обърка! Опитайте пак по-късно!")
        }
      });
    }
  }

  descriptionChangedHandler(event: Event){
    this.description = (event.target as any).value
  }

  fileChoosen(event: any){
    if(this.id && this.thumnailBeforeChange && !this.forDelete.includes(this.thumnailBeforeChange)){
      this.forDelete.push(this.thumnailBeforeChange);
    }
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
    if(!this.uploadData.steps[i].images){ this.uploadData.steps[i].images = [] }
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

  editChalangeHandler(){
    this.chalangeService.editChalange(localStorage.getItem("name"), localStorage.getItem("key"), this.uploadData.title, this.uploadData.description, this.uploadData.thumnail, this.uploadData.status, this.uploadData.steps, this.files, this.id!, this.forDelete ? JSON.stringify(this.forDelete!) : "null")?.subscribe({
      next: (value: any) => {
          this.loading = false;
          if(value.error){
            alert(value.error)
          }
          this.router.navigate(["/profile/"+localStorage.getItem("name")]);
      },
      error: (err: any) => {
        console.log(err);
        this.loading = false;
        alert("Нещо се обърка! Опитайте пак по-късно!");
      }
    });
  }

  uploadChalangeHandler(form: any){
    if(form.invalid){ return }
    if(this.uploadData.status === "планиран"){ this.uploadData.steps = [] }
    this.loading = true;
    if(this.id){ this.editChalangeHandler(); return; }
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
    if(this.stepsImages.includes(imagee)){
      this.forDelete.push(imagee);
      return;
    }
    this.files.splice(imagee[2], 1);
  }

}
