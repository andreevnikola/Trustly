import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor( private authService: AuthService, private router: Router ){
    if(localStorage.getItem("key")){
      this.authService.checkLoged().subscribe({
        next: (value) => {
            this.authService.loged = true;
        }
      });
    }
  }
}
