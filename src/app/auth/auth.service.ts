import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser, IError, IEdit } from '../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loged: boolean = false;
  name: string | null = localStorage.getItem('name');

  get isLoged(){
    return localStorage.getItem("name");
  }

  constructor(private httpClient: HttpClient) { }

  registerUser(name: string, mail: string, pass: string) {
    return this.httpClient.get<IUser>(`http://localhost:8080/api/users/add/${name}/${pass}/${mail}`);
  }

  editUserInfo(name: string | null, mail: string | null, pass: string | undefined, oldPass: string | undefined, oldName: string | null, file: File | undefined, oldLogo: string | null) {
    const formData = new FormData(); 
    if(file){
      formData.append("file", file, file.name);
    }
    if(!oldLogo){ oldLogo = "unknown" }
    return this.httpClient.post<IEdit>(`http://localhost:8080/api/users/edit/${name}/${pass}/${mail}/${oldName}/${oldPass}/${oldLogo}`, formData);
  }

  loginUser(name: string, pass: string) {
    return this.httpClient.get<IUser>(`http://localhost:8080/api/users/login/${name}/${pass}`);
  }

  checkLoged(key: string){
    return this.httpClient.get<IError>(`http://localhost:8080/api/users/auth/${key}`);
  }

  checkUsernameExistance(name: string, oldName: string | null){
    return this.httpClient.get<IError>(`http://localhost:8080/api/users/exists/${name}/${oldName}`);
  }

  verifyEmail(mail: string | null, key: string, name: string | null){
    return this.httpClient.get<IError>(`http://localhost:8080/api/users/activate/${mail}/${key}/${name}`);
  }

  activateMail(mail: string | null, name: string | null){
    return this.httpClient.get<IError>(`http://localhost:8080/api/users/verify/${name}/${mail}`);
  }

  logoutUser(){
    this.loged = false;
    localStorage.clear();
  }

}
