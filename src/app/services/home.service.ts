import { Filiado } from './../models/Filiado';
import { Mestre } from './../models/Mestre';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../models/Evento';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  baseURL = `${environment.apiURL}/home`;

  constructor(private http: HttpClient) { }

  public getEventos(): Observable<Evento[]>{
    return this.http.get<Evento[]>(`${this.baseURL}/eventos`);
  }

  public getDiretorias(): Observable<Mestre[]>{
    return this.http.get<Mestre[]>(`${this.baseURL}/diretorias`);
  }

  public getFiliados(): Observable<Filiado[]>{
    return this.http.get<Filiado[]>(`${this.baseURL}/filiados`);
  }
}
