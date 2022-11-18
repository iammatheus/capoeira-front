import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ImgurApiService {
  private readonly IMGUR_UPLOAD_URL = 'https://api.imgur.com/3/image/';
  private readonly clientId = 'c1fea4c597fa3c9';

  constructor(
    private http: HttpClient
  ) {
  }

  upload(b64Image: any) {
    console.log(b64Image)
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Client-ID ${this.clientId}`
      }),
    };
    const formData = new FormData();
    formData.append('image', b64Image);
    return this.http.post(`${this.IMGUR_UPLOAD_URL}`, formData, httpOptions);
  }
}
