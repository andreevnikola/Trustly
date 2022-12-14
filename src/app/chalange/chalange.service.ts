import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { IError } from '../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ChalangeService {

  constructor( private authService: AuthService, private httpClient: HttpClient ) { }

  uploadChalange(
    name: string | null,
    key: string | null,
    title: string | undefined,
    description: string,
    thumnail: string,
    status: string | undefined,
    steps: any[] | undefined,
    files: File[] | undefined,
  ){
    if(!this.authService.loged){
      return;
    }
    let formData = new FormData();
    formData.append("title", title!);
    formData.append("description", description);
    if(thumnail){ formData.append("thumnail", thumnail); }
    if(steps){ formData.append("status", status!); }
    formData.append("steps", JSON.stringify(steps));
    if(files){
      files.map((file) => {
        formData.append("pictures", file);
      });
    }

    return this.httpClient.post<IError>(`http://localhost:8080/api/chalange/upload/${name}/${key}`, formData);
  }

  editChalange(
    name: string | null,
    key: string | null,
    title: string | undefined,
    description: string,
    thumnail: string,
    status: string | undefined,
    steps: any[] | undefined,
    files: File[] | undefined,
    id: string,
    imagesForDelete: string,
  ){
    if(!this.authService.loged){
      return;
    }
    let formData = new FormData();
    formData.append("title", title!);
    formData.append("id", id);
    if(imagesForDelete !== "null"){ formData.append("imagesForDelete", imagesForDelete) }
    else { formData.append("imagesForDelete", "null") }
    formData.append("description", description);
    if(thumnail){ formData.append("thumnail", thumnail); }
    if(steps){ formData.append("status", status!); }
    formData.append("steps", JSON.stringify(steps));
    if(files){
      files.map((file) => {
        formData.append("pictures", file);
      });
    }

    return this.httpClient.post<IError>(`http://localhost:8080/api/chalange/edit/${name}/${key}`, formData);
  }

  getChalangeById( id: string, key: string | null ){
    if(!key){ key = "null" }
    return this.httpClient.get<any>(`http://localhost:8080/api/chalanges/getbyid/${id}/${key}`);
  }

  getChalanges(){
    return this.httpClient.get<IError>(`http://localhost:8080/api/chalanges/all`);
  }

  likeComment( liker: string, comment: string ){
    return this.httpClient.get<IError>(`http://localhost:8080/api/chalanges/likecomment/${liker}/${comment}`);
  }

  dislikeComment( liker: string, comment: string ){
    return this.httpClient.get<IError>(`http://localhost:8080/api/chalanges/dislikecomment/${liker}/${comment}`);
  }

  likeChalange( liker: string, liked: string, chalange: string ){
    return this.httpClient.get<IError>(`http://localhost:8080/api/chalanges/like/${liker}/${liked}/${chalange}`);
  }

  dislikeChalange( liker: string, liked: string, chalange: string ){
    return this.httpClient.get<IError>(`http://localhost:8080/api/chalanges/dislike/${liker}/${liked}/${chalange}`);
  }

  sendComment( commentator: string, message: string, chalange: string ){
    return this.httpClient.get<IError>(`http://localhost:8080/api/chalanges/comment/${commentator}/${message}/${chalange}`);
  }

  deleteChalange( key: string, chalange: string ){
    return this.httpClient.get<IError>(`http://localhost:8080/api/chalanges/delete/${key}/${chalange}`);
  }

  deleteComment( key: string, comment: string ){
    return this.httpClient.get<IError>(`http://localhost:8080/api/chalanges/comment/delete/${key}/${comment}`);
  }

}
