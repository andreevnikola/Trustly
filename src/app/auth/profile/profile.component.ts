import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  file: File | undefined;
  password_: string | undefined;
  name_: string | null = localStorage.getItem("name");
  mail_: string | null = localStorage.getItem("mail");
  oldPass: string | undefined;
  edit: boolean = false;
  editConfirm: boolean = false;
  usernameTaken: boolean = false;
  passwordNotWright: boolean = false;
  url: string | ArrayBuffer | null | undefined = localStorage.getItem("logo");
  confirmed: string | null = localStorage.getItem("activated");
  loading: boolean = false;

  constructor( private authService: AuthService, private router: Router ) { console.log(localStorage.getItem("logo_id")) }

  fileChoosen(event: any){
    this.file = event.target.files[0];
    var reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);
		
		reader.onload = (_event) => {
			this.url = reader.result; 
		}
  }

  continueEditing(name: string, mail: string, password: string, form: any){
    if(form.invalid){
      return
    }
    this.name_ = name;
    this.mail_ = mail;
    this.password_ = password;
    this.authService.checkUsernameExistance(name, localStorage.getItem("name")).subscribe({
      next: (value) => {
        if(value.error){
          this.usernameTaken = true;
          return
        }
        this.editConfirm = true;
        this.edit = false;
      },
      error: () => {
        alert("Нещо се обърка!")
      }
    });
  }

  confirm(form: any){
    if(form.invalid){
      return
    }
    if(!this.password_){
      this.password_ = "unchanged"
    }
    this.loading = true;
    this.authService.editUserInfo(this.name_, this.mail_, this.password_, this.oldPass, localStorage.getItem("name"), this.file, localStorage.getItem("logo_id")).subscribe({
      next: (value) => {
        this.loading = false;
        if(value.error){
          this.passwordNotWright = true;
          return
        }
        if(value.mailIsChanged){ console.log('baba ti e mnogo seksi'); this.confirmed = null; localStorage.removeItem('activated') }
        localStorage.setItem("name", this.name_!);
        localStorage.setItem("mail", this.mail_!);
        localStorage.setItem("key", value.key!);
        if(value.logo!){
          localStorage.setItem("logo", value.logo!)
          localStorage.setItem("logo_id", value.logo_id!)
        }
        this.editConfirm = false;
        this.edit = false;
      },
      error: (err) => {
        this.loading = false;
        console.log(err)
        alert("Нещо се обърка!")
      }
    });
  }

  confirmMail(){
    this.authService.activateMail(this.mail_, this.name_).subscribe({
      next: () => {
        this.router.navigate(["/auth/verify"]);
      },
      error: () => { alert("Нещо се обърка") }
    });
  }

}
