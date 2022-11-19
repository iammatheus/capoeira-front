import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ImgurApiService {
  private readonly IMGUR_UPLOAD_URL = 'https://api.imgur.com/3/image/';
  private readonly clientId = '629dd7eb50f8526';

  constructor(
    private http: HttpClient
  ) {
  }

  upload(b64Image: any) {
    const httpOptions = {
      headers: new HttpHeaders().set('Authorization', `Client-ID ${this.clientId}`),
    };
    const formData = new FormData();
    formData.append('image', b64Image);
    return this.http.post(`${this.IMGUR_UPLOAD_URL}`, formData, httpOptions);
  }
}
