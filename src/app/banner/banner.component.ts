import { Component } from '@angular/core';
import { SpotifyService } from '../spotify.service';
import { User } from '../user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.sass'
})
export class BannerComponent {

  user$: Observable<User | null> | undefined;
  userDisplay : User | null | undefined;
  
  constructor(private spotifyService: SpotifyService) {}
  
  
  ngOnInit() {
    this.user$ = this.spotifyService.user;
    this.user$.subscribe(result => this.userDisplay = result);
    console.log(this.userDisplay);
  }
  

}
