import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  passwordType: "password" | "text" = "password";
  nameOrPassErr: boolean = false;

  constructor( private authService: AuthService, private router: Router ) { }

  loginHandler(name: string, passwrd: string){
    this.authService.loginUser(name, passwrd).subscribe({
      next: (value) => {
        if(value.error === "Сгрешено име или парола!"){
          this.nameOrPassErr = true;
          return;
        }
        localStorage.setItem("name", value.name!);
        localStorage.setItem("mail", value.mail!);
        localStorage.setItem("key", value.key!);
        if(value.activated){
          localStorage.setItem("activated", value.activated!);
        }
        if(value.logo!){
          localStorage.setItem("logo", value.logo!)
          localStorage.setItem("logo_id", value.logo_id!)
        }
        this.authService.loged = true;
        this.authService.name = value.name!;
        this.router.navigate(['/profile/'+value.name!]);
      },
      error: (err) => {
        alert("Нещо се обърка! Опитайте по-късно!")
      }
    });
  }

}
