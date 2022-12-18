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

    return this.httpClient.post<IError>(`http://localhost:8080/api/chalange/edit/${name}/key`, formData);
  }

  getChalangeById( id: string ){
    return this.httpClient.get<any>(`http://localhost:8080/api/chalanges/getbyid/${id}/key`);
  }

  getChalanges(isFollowing: boolean, search?: null | string){
    if(search){
      return this.httpClient.get<IError>(`http://localhost:8080/api/chalanges/search/${search!}`);
    }
    if(isFollowing){
      return this.httpClient.get<IError>(`http://localhost:8080/api/chalanges/following/key`);
    }
    return this.httpClient.get<IError>(`http://localhost:8080/api/chalanges/all`);
  }

  likeComment( comment: string ){
    return this.httpClient.get<IError>(`http://localhost:8080/api/chalanges/likecomment/${comment}/key`);
  }

  dislikeComment( comment: string ){
    return this.httpClient.get<IError>(`http://localhost:8080/api/chalanges/dislikecomment/${comment}/key`);
  }

  likeChalange( liked: string, chalange: string ){
    return this.httpClient.get<IError>(`http://localhost:8080/api/chalanges/like/${liked}/${chalange}/key`);
  }

  dislikeChalange( liked: string, chalange: string ){
    return this.httpClient.get<IError>(`http://localhost:8080/api/chalanges/will_fail/${liked}/${chalange}/key`);
  }

  undodislikeChalange( liked: string, chalange: string ){
    return this.httpClient.get<IError>(`http://localhost:8080/api/chalanges/undo_will_fail/${liked}/${chalange}/key`);
  }

  undolikeChalange( liked: string, chalange: string ){
    return this.httpClient.get<IError>(`http://localhost:8080/api/chalanges/dislike/${liked}/${chalange}/key`);
  }

  sendComment( message: string, chalange: string ){
    return this.httpClient.get<IError>(`http://localhost:8080/api/chalanges/comment/${message}/${chalange}/key`);
  }

  deleteChalange( chalange: string ){
    return this.httpClient.get<IError>(`http://localhost:8080/api/chalanges/delete/${chalange}/key`);
  }

  deleteComment( comment: string ){
    return this.httpClient.get<IError>(`http://localhost:8080/api/chalanges/comment/delete/${comment}/key`);
  }

}
