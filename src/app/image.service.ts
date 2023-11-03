import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  defaultUrl = 'https://api.imgbb.com/1/upload'

  constructor(private http: HttpClient) { }


  uploadFile(file: any) {
    // Create form data
    const formData = new FormData();
    // Store form name as "file" with file data
    formData.append('image', file, file.name);
    const httpOptions = {
      params: new HttpParams().set('key', environment.apiKey).set('expiration', environment.expirationInSeconds.toString()),
    }
    // Make http post request over api
    return this.http.post(this.defaultUrl, formData, httpOptions).pipe(map((resp: any) => {
      return resp.data.display_url;
    }));
  }
}
