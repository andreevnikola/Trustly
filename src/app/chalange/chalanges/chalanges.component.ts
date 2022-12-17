import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ChalangeService } from '../chalange.service';

@Component({
  selector: 'app-chalanges',
  templateUrl: './chalanges.component.html',
  styleUrls: ['./chalanges.component.scss']
})
export class ChalangesComponent implements OnInit {

  loading: boolean = true;
  data: any;
  creators: any;
  profiles: any;
  @Input() isFollowing: boolean = false;
  @Input() search: string | undefined | null = null;

  constructor(private chalangeService: ChalangeService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.search = this.route.snapshot.paramMap.get('search');
    this.getData();
    this.router.events.subscribe((event: any) => {
      if(this.isFollowing){ return; }
      if (event instanceof NavigationEnd) {
        if(this.search === this.route.snapshot.paramMap.get('search')){ return; }
        this.search = this.route.snapshot.paramMap.get('search');
        this.getData();
      }
    });
  }

  getData(){
    this.chalangeService.getChalanges(this.isFollowing, localStorage.getItem("key"), this.search).subscribe({
      next: (value: any) => {
        this.loading = false;
        if(value.error){
          alert(value.error);
        }
        this.data = value.data;
        this.creators = value.creators;
        console.log(value.profiles)
        this.profiles = value.profiles;
      },
      error: (err) => {
        console.log(err)
        this.loading = false;
      }
    });
  }

}
