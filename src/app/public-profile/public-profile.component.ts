import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss']
})
export class PublicProfileComponent implements OnInit{

  profileIcon: string = "";
  username: string | undefined = "";
  user_mail: string | undefined = "";
  myUserName: string | null = localStorage.getItem("name");
  chalanges_nmb: string = "0";
  likes: string = "0";
  subs: string = "0";
  reports: string = "0";
  chalanges_ids: string[] = [];
  chalanges: any[] = [];
  profile_id: string = "";
  subscribed: boolean = false;
  loading: boolean = true;

  constructor( private profileService: ProfileService, private route: ActivatedRoute, private router: Router ) { }

  ngOnInit(): void {
    this.getData();
    this.router.events.subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
            this.getData();
        }
    });
  }

  getData(){
    this.profileService.getDataAboutProfile(this.route.snapshot.paramMap.get('name')!, localStorage.getItem("key")!).subscribe({
      next: (value) => {
        this.username = value.name!;
        this.user_mail = value.mail!;
        this.profileIcon = value.logo!;
        this.likes = value.likes!;
        this.reports = value.reports!;
        this.subs = value.subs!;
        this.chalanges_nmb = value.chalanges_nmb!;
        this.chalanges_ids = value.chalanges!;
        this.profile_id = value.id!;
        this.subscribed = value.subscribed!;
        this.profileService.getChalangesByProfile(this.profile_id).subscribe({
          next: (value) => {
            this.loading = false;
            this.chalanges = value.chalanges;
          },
          error: (err) => {
            this.loading = false;
            console.log(err);
            alert("Нещо се обърка! Опитайте пак по-късно!")
          },
        });
      },
      error: (err) => {
        this.router.navigate(['/']);
      }
    });
  }

  subscribeHandler(){
    this.profileService.subscribeToUser(localStorage.getItem("key")!, this.profile_id).subscribe({
      next: (value) => {
        if(value.error === "Вече сте абонирани за този потребител!"){
          alert(value.error)
        }
        if(value.error){
          localStorage.clear();
          this.router.navigate(["/login"]);
          return;
        }
        this.subscribed = true;
        this.subs = (parseInt(this.subs) + 1).toString();
      },
      error: (err) => {
        console.log(err);
        alert("Нещо се обърка! Опитайте пак по-късно!")
      }
    });
  }

  unsubscribeHandler(){
    this.profileService.unsubscribeFromUser(localStorage.getItem("key")!, this.profile_id).subscribe({
      next: (value) => {
        if(value.error){
          localStorage.clear();
          this.router.navigate(["/login"]);
          return;
        }
        this.subscribed = false;
        this.subs = (parseInt(this.subs) - 1).toString();
      },
      error: (err) => {
        console.log(err);
        alert("Нещо се обърка! Опитайте пак по-късно!")
      }
    });
  }

}
