import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  url = 'https://mbtnnx4qd8.execute-api.us-east-1.amazonaws.com/'

  constructor(private http: HttpClient) { }

  getUploadURL() {
    return this.http.get(this.url).pipe(map((res: any) => {
      return res.presignedUrl;
    }));
  }

  doUpload(url: string, file: any) {
    return this.http.put(url, file);
  }
}
