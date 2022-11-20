import { Mestre } from './../models/Mestre';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedResult } from '@app/models/Pagination';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class MestreService {

  baseURL = `${environment.apiURL}/diretorias`;

  constructor(private http: HttpClient) { }

  public getMestres(page?: number, itemsPerPage?: number, term?: string): Observable<PaginatedResult<Mestre[]>> {
    const paginatedResult: PaginatedResult<Mestre[]> = new PaginatedResult<Mestre[]>();

    let params = new HttpParams;

    if (page != null && itemsPerPage != null) {
      params = params.append('skip', page.toString())
      params = params.append('limit', itemsPerPage.toString());
    }

    if (term != null && term != '') {
      params = params.append('term', term);
    }

    return this.http.get<Mestre[]>(this.baseURL, { observe: 'response', params })
      .pipe(
        take(1),
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.has('Pagination')) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'))
          }
          return paginatedResult;
        })
      );
  }

  public getMestreById(id: string): Observable<Mestre> {
    return this.http.get<Mestre>(`${this.baseURL}/${id}`);
  }

  public post(mestre: Mestre): Observable<Mestre> {
    return this.http.post<Mestre>(this.baseURL, mestre);
  }

  public put(mestre: Mestre): Observable<Mestre> {
    return this.http.put<Mestre>(`${this.baseURL}/${mestre._id}`, mestre);
  }

  public deleteMestre(id: string): Observable<any> {
    return this.http.delete(`${this.baseURL}/${id}`);
  }

  postUpload(mestreId: string, file: File): Observable<Mestre> {
    const fileToUpload = file[0] as File;
    const formData = new FormData();
    formData.append('file', fileToUpload);

    return this.http.post<Mestre>(`${this.baseURL}/upload-image/${mestreId}`, formData);
  }
}
