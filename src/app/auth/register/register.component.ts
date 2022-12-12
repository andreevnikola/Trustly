import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  passwordType: "password" | "text" = "password";
  usernameTaken: boolean = false;

  constructor( private authService: AuthService, private router: Router ) { }

  handleRegister(name: string, mail: string, password: string){
    this.authService.registerUser(name, mail, password).subscribe({
      next: (value) => {
        if(value.error === "Потребителското име е заето!"){
          this.usernameTaken = true;
          return;
        }
        localStorage.setItem("name", value.name!);
        localStorage.setItem("mail", value.mail!);
        localStorage.setItem("key", value.key!);
        this.authService.loged = true;
        this.router.navigate(['/']);
      },
      error: (err) => {
        alert("Нещо се обърка! Моля опитайте пак по-късно!");
      }
    });
  }

}
