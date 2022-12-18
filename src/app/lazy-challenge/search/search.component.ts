import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  search: string | undefined | null;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.search = this.route.snapshot.paramMap.get('search');
    if(!this.search){
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.search = this.route.snapshot.paramMap.get('search');
      }
    });
  }

}
