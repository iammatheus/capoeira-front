import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ImgurApiService {
  private readonly IMGUR_UPLOAD_URL = 'https://api.imgur.com/3/image/';

  constructor(private http: HttpClient) { }

  upload(b64Image: any) {
    const httpOptions = {
      headers: new HttpHeaders().set('authorization', `Client-ID ${environment.CLIENT_ID}`),
    };
    const formData = new FormData();
    formData.append('image', b64Image);
    return this.http.post(`${this.IMGUR_UPLOAD_URL}`, formData, httpOptions);
  }
}
