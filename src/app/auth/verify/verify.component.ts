import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit, OnDestroy{

  loading: boolean = false;
  error: boolean = false;
  demo: boolean = false;
  wait: any;

  constructor( private authService: AuthService, private route: ActivatedRoute, private router: Router ) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        if(!params["mail"]){
          this.demo = true;
          return;
        }
        this.loading = true;
        this.authService.verifyEmail(params["mail"], params["key"], params["name"]).subscribe({
          next: (value) => {
            if(value.error){
              this.loading = false;
              this.error = true;
              return;
            }
            this.loading = false;
            this.error = false;
            localStorage.setItem("activated", "yes");
            this.wait = setTimeout(() => {
              this.router.navigate(["/auth/profile/settings"]);
            }, 5000);
          },
          error: (err) => {
            this.loading = false;
            this.error = true;
          }
        });
      }
    );
  }

  ngOnDestroy(): void {
    clearInterval(this.wait)
  }

}
