import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedResult } from '@app/models/Pagination';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Evento } from '../models/Evento';


@Injectable()
export class EventoService {
  baseURL = `${environment.apiURL}/eventos`;

  constructor(private http: HttpClient) { }

  public getEventos(page?: number, itemsPerPage?: number, term?: string): Observable<PaginatedResult<Evento[]>>{
    const paginatedResult: PaginatedResult<Evento[]> = new PaginatedResult<Evento[]>();

    let params = new HttpParams;

    if(page != null && itemsPerPage != null){
      params = params.append('skip', page.toString())
      params = params.append('limit', itemsPerPage.toString());
    }

    if(term != null && term != ''){
      params = params.append('term', term);
    }

    return this.http.get<Evento[]>(this.baseURL, { observe: 'response', params })
      .pipe(
        take(1),
        map(response => {
          paginatedResult.result = response.body;
          if(response.headers.has('Pagination')) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'))
          }
          return paginatedResult;
        })
      );
  }

  public getEventoById(id: string): Observable<Evento>{
    return this.http.get<Evento>(`${this.baseURL}/${id}`);
  }

  public post(evento: Evento): Observable<Evento>{
    return this.http.post<Evento>(this.baseURL, evento);
  }

  public put(evento: Evento): Observable<Evento>{
    return this.http.put<Evento>(`${this.baseURL}/${evento._id}`, evento);
  }

  public deleteEvento(id: string): Observable<any>{
    return this.http.delete(`${this.baseURL}/${id}`);
  }

  postUpload(eventoId: string, file: File): Observable<Evento> {
    const fileToUpload = file[0] as File;
    const formData = new FormData();
    formData.append('file', fileToUpload);

    return this.http.post<Evento>(`${this.baseURL}/upload-image/${eventoId}`, formData);
  }
}
