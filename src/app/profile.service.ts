import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from './shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private httpClient: HttpClient) { }

  getDataAboutProfile(name: string){
    return this.httpClient.get<IUser>(`http://localhost:8080/api/users/profile/${name}/key`);
  }

  getChalangesByProfile(profile: string){
    return this.httpClient.get<any>(`http://localhost:8080/api/chalanges/getbyprofile/${profile}`);
  }

  subscribeToUser(subscriber: string, subscribed: string){
    return this.httpClient.get<any>(`http://localhost:8080/api/profile/subscribe/${subscriber}/${subscribed}`);
  }

  unsubscribeFromUser(subscriber: string, subscribed: string){
    return this.httpClient.get<any>(`http://localhost:8080/api/profile/unsubscribe/${subscriber}/${subscribed}`);
  }
}
