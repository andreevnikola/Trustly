import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import {
  trigger,
  style,
  transition,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('menu_animation', [
      transition(':leave', [style({
        opacity: 1,
      }), animate('150ms', style({opacity: 0}))]),
    ])
  ]
})
export class HeaderComponent {

  mobileMenuShown: boolean = false;

  constructor( public router: Router, public authService: AuthService ) {  }

  logoutHandler(){
    this.authService.logoutUser();
  }

  showMobileMenu(){
    this.mobileMenuShown = !this.mobileMenuShown;
  }

  searchHanfler(input: string){
    this.router.navigate(['/search/'+input]);
    this.mobileMenuShown = false;
  }

}
