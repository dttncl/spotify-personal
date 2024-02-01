import { Component } from '@angular/core';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.sass'
})
export class BannerComponent {

  constructor(private spotifyService: SpotifyService) {}

  search(user_id: string): void {
    this.spotifyService.generatePlaylists(user_id);
  }
}
