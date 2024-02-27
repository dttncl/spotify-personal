import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})

export class SpotifyService {

  private clientId = "2975874d026e40f48153f609602a8578";
  private params = new URLSearchParams(window.location.search);
  private code = this.params.get("code");

  private _user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public readonly user: Observable<User | null> = this._user.asObservable();

  constructor(private http: HttpClient) { 
    if (!this.code) {
      this.redirectToAuthCodeFlow(this.clientId);
    } else {
      this.initialize();
    }
  }

  public getUserValue(): User | null {
    return this._user.getValue();
  }
  
  private initialize() {
    const ofAccessToken = this.getAccessToken(this.clientId, this.code!);
    ofAccessToken.subscribe((accessToken: string) => {
      this.generateUser(accessToken).subscribe((user: User) => {
        this._user.next(user); // update the user variable
        console.log(user)});
    });
  }
  
  private async redirectToAuthCodeFlow(clientId: string) {
    const verifier = this.generateCodeVerifier(128);
    const challenge = await this.generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:4200/");
    params.append("scope", "user-read-private user-read-email");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }
  
  private generateCodeVerifier(length: number) {
      let text = '';
      let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
      for (let i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
  }
  
  private async generateCodeChallenge(codeVerifier: string) {
      const data = new TextEncoder().encode(codeVerifier);
      const digest = await window.crypto.subtle.digest('SHA-256', data);
      return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
  }

  private getAccessToken(clientId: string, code: string) : Observable<string> {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:4200/");
    params.append("code_verifier", verifier!);

    const headers = new HttpHeaders()
                        .set('Content-Type','application/x-www-form-urlencoded');

    return this.http.post('https://accounts.spotify.com/api/token', params.toString(), { headers: headers })
    .pipe(map((response: any) => {
      return response.access_token;
    }));
  }

  generateUser(token: string): Observable<User> {
    return new Observable<User>((observer) => {
        let endpoint = 'https://api.spotify.com/v1/me';

        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${token}`);

        this.http.get(endpoint, { headers }).subscribe(result => {
            let idResult = Object.values(result)[3];
            let nameResult = Object.values(result)[0];

            let user: User = {
                id: idResult,
                name: nameResult
            };

            observer.next(user); // emit the user object
            observer.complete(); // complete the observable
        }, error => {
            console.error('HTTP Error', error);
            observer.error(error); 
        });
    });
  }

}
