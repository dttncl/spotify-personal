import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor(private http: HttpClient) { }

  private url = "https://api.spotify.com/v1/users/";
  private keyword = "/playlists?offset=0&limit=20";

  createEndpoint(user_id: string) {
    // generate ENDPOINT
    console.log(this.url + user_id + this.keyword);
    return this.url + user_id + this.keyword;
  }

  /*
  generatePlaylists(user_id: string) : void {
    let endpoint = this.createEndpoint(user_id);
  }
  */

  generatePlaylists(user_id: string) {
    let endpoint = this.createEndpoint(user_id);
    const headers = new HttpHeaders()
      .set('Authorization','Bearer BQAEtOfVwQs6GynHxlUrMKKujs5XqVryNjo07gauLiOJijaNoYIJSSjikMpG1XfpF7hZFBvvO7D-70CU4UrLkVQc7n45bfGiXPmm41-qOrIMMkeqtqA');
    return this.http.get(endpoint, {headers}).pipe(map(data => {})).subscribe(result => {
      console.log(result);
    });
  }

}
