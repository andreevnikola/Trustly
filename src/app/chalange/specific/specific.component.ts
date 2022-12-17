import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute, Router, Event, RouterEvent, NavigationEnd } from '@angular/router';
import { ProfileService } from 'src/app/profile.service';
import { IUser } from 'src/app/shared/interfaces';
import { ChalangeService } from '../chalange.service';
import {
  trigger,
  style,
  transition,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-specific',
  templateUrl: './specific.component.html',
  styleUrls: ['./specific.component.scss'],
  animations: [
    trigger('maximizeImage', [
      transition(':enter', [style({
        opacity: 0
      }), animate('150ms', style({opacity: 1}))]),
      transition(':leave', [style({
        opacity: 1,
      }), animate('250ms', style({opacity: 0}))]),
    ])
  ]
})
export class SpecificComponent implements OnInit{

  id: string | null = "";
  data: any;
  user: IUser | undefined;
  profileIcon: string = "";
  username: string | undefined = "";
  user_mail: string | undefined = "";
  myUserName: string | null = localStorage.getItem("name");
  chalanges_nmb: string = "0";
  likes: string = "0";
  subs: string = "0";
  reports: string = "0";
  chalanges_ids: string[] = [];
  subscribed: boolean = false;
  loading: boolean = true;
  profile_id: string = "";
  maximizedImage: string[] | false = false;
  liked: boolean = false;
  disliked: boolean = false;
  comments: any[] | undefined;
  likedComments: any[] = [];
  commentInputHeight = "22px";

  constructor( private route: ActivatedRoute, private chalangeService: ChalangeService, public router: Router, private profileService: ProfileService ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.id = this.route.snapshot.paramMap.get('id');
    this.chalangeService.getChalangeById(this.id!, localStorage.getItem('key')).subscribe({
      next: (value: any) => {
        if(value?.error){
          this.router.navigate(['/']);
          return;
        }
        this.data = value.chalange;
        this.user = value.creator;
        this.liked = value.isLiked;
        this.disliked = value.isDisLiked;
        this.comments = value.comments!;
        value.comments?.map((comment: any) => {
          this.likedComments.push(comment.likers?.includes(this.myUserName) ? comment._id : null)
        });
        this.profileService.getDataAboutProfile(this.user?.name!, localStorage.getItem("key")).subscribe({
          next: (value: any) => {
            this.username = value.name!;
            this.user_mail = value.mail!;
            this.profileIcon = value.logo!;
            this.likes = value.likes!.toString();
            this.reports = value.reports!;
            this.subs = value.subs!;
            this.chalanges_nmb = value.chalanges_nmb!;
            this.chalanges_ids = value.chalanges!;
            this.profile_id = value.id!;
            this.subscribed = value.subscribed!;
            this.loading = false;
          },
          error: (err) => {
            this.router.navigate(['/']);
          }
        });
      },
      error: (err) => {
        console.log(err);
        alert("Нещо се обърка!")
      }
    });
  }

  subscribeHandler(){
    this.profileService.subscribeToUser(localStorage.getItem("key")!, this.profile_id).subscribe({
      next: (value: any) => {
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
      error: (err: any) => {
        console.log(err);
        alert("Нещо се обърка! Опитайте пак по-късно!")
      }
    });
  }

  unsubscribeHandler(){
    this.profileService.unsubscribeFromUser(localStorage.getItem("key")!, this.profile_id).subscribe({
      next: (value: any) => {
        if(value.error){
          alert(value.error)
          return;
        }
        this.subscribed = false;
        this.subs = (parseInt(this.subs) - 1).toString();
      },
      error: (err: any) => {
        console.log(err);
        alert("Нещо се обърка! Опитайте пак по-късно!")
      }
    });
  }

  seeImage(img: string){
    window.open(img);
  }

  likeChalangeHandler(){
    if(!this.myUserName){ return }
    if(this.disliked){
      this.undodislikeChalangeHadnler();
    }
    this.chalangeService.likeChalange(localStorage.getItem("key")!, this.profile_id!, this.id!).subscribe({
      next: (value: any) => {
        if(value.error){
          alert(value.error);
          return;
        }
        if(!this.likes){ this.likes = "0" }
        this.likes = (parseInt(this.likes) + 1).toString();
        this.liked = true;
        this.data.likes += 1;
      },
      error: (err) => {
        alert("Нещо се обърка! Опитайте пак по-късно!")
      }
    });
  }

  undolikeChalangeHadnler(){
    this.chalangeService.undolikeChalange(localStorage.getItem("key")!, this.profile_id!, this.id!).subscribe({
      next: (value: any) => {
        if(value.error){
          alert(value.error);
          return;
        }
        this.likes = (parseInt(this.likes) - 1).toString();
        this.liked = false;
        this.data.likes -= 1;
      },
      error: (err) => {
        alert("Нещо се обърка! Опитайте пак по-късно!")
      }
    });
  }

  dislikeChalangeHandler(){
    if(!this.myUserName){ return }
    if(this.liked){
      this.undolikeChalangeHadnler();
    }
    this.chalangeService.dislikeChalange(localStorage.getItem("key")!, this.profile_id!, this.id!).subscribe({
      next: (value: any) => {
        if(value.error){
          alert(value.error);
          return;
        }
        if(!this.data.dislikes){ this.data.dislikes = 0 }
        this.disliked = true;
        this.data.dislikes += 1;
      },
      error: (err: any) => {
        alert("Нещо се обърка! Опитайте пак по-късно!")
      }
    });
  }

  undodislikeChalangeHadnler(){
    this.chalangeService.undodislikeChalange(localStorage.getItem("key")!, this.profile_id!, this.id!).subscribe({
      next: (value: any) => {
        if(value.error){
          alert(value.error);
          return;
        }
        this.disliked = false;
        this.data.dislikes -= 1;
      },
      error: (err) => {
        alert("Нещо се обърка! Опитайте пак по-късно!")
      }
    });
  }

  sendCommentHandler(message: string){
    if(!localStorage.getItem('key')){ return; }
    this.chalangeService.sendComment(localStorage.getItem('key')!, message, this.id!).subscribe({
      next: (value: any) => {
        if(value.error){
          console.log(value.error)
          alert("В акаунта ви се случило ново влизане! Влезте в аканунта си отонво!");
          this.router.navigate(['/auth/login']);
          return;
        }
        const raw_date = new Date();
        const for_upload_date = raw_date.toLocaleDateString();
        const time = raw_date.toTimeString().slice(0, 5);
        this.comments?.unshift({
          commentator: localStorage.getItem('name'),
          message: message,
          date: for_upload_date,
          time: time,
          logo: localStorage.getItem('logo'),
          _id: value.id
        });
      },
      error: (err) => {
        console.log(err);
        alert("Нещо се обърка! Опитайте пак по-късно!")
      }
    });
  }

  likeCommentHandler(index: number){
    if( !localStorage.getItem("key") ){ return }
    this.chalangeService.likeComment(localStorage.getItem("key")!, this.comments![index]._id).subscribe({
      next: (value) => {
        if(value.error){
          alert(value.error);
          return;
        }
        this.likedComments.push(this.comments![index]._id);
        if(!this.comments![index].likers){ this.comments![index].likers = [] }
        this.comments![index].likers.push(this.comments![index].likers.indexOf(this.myUserName));
      },
      error: (err) => {
        console.error(err);
        (err);
        alert("Нещо се обърка! Опитайте пак по-късно!");
      }
    });
  }

  dislikeCommentHandler(index: number){
    if( !localStorage.getItem("key") ){ return }
    this.chalangeService.dislikeComment(localStorage.getItem("key")!, this.comments![index]._id).subscribe({
      next: (value) => {
        if(value.error){
          alert(value.error);
          return;
        }
        this.likedComments.splice(index, 1);
        this.comments![index].likers.splice(this.comments![index].likers.indexOf(this.myUserName), 1);
      },
      error: (err) => {
        console.error(err);
        (err);
        alert("Нещо се обърка! Опитайте пак по-късно!");
      }
    });
  }

  deleteCommentHandler(index: number){
    let comment = this.comments![index]._id;
    this.chalangeService.deleteComment(localStorage.getItem('key')!, comment).subscribe({
      next: (value) => {
        if(value.error){
          alert(value.error);
          return;
        }
        this.comments!.splice(index, 1);
      },
      error: (err) => {
        console.error(err);
        alert('Нещо се обърка! Опитайте пак по-късно!')
      }
    });
  }

  commentInputChanged(input: HTMLElement){
    input.style.height = "0px";
    input.style.height = (input.scrollHeight - 10) + "px";
  }

}