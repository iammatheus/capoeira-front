import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@app/models/Identity/User';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, take } from 'rxjs/operators';
import { UserUpdate } from '@app/models/Identity/UserUpdate';
import jwt_decode from 'jwt-decode';

@Injectable()
export class AccountService {

  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  baseURL = `${environment.apiURL}`;

  constructor(private http: HttpClient) { }

  public get decodeToken(): string {
    try {
      const token = localStorage.getItem('user');
      if (!token) return null;

      const tokenDecode = jwt_decode(token);
      return tokenDecode['userId'];
    } catch (error) {
      return error;
    }
  }

  public register(model: any): Observable<void> {
    return this.http.post<User>(`${this.baseURL}/register`, model).pipe(
      take(1),
      map((res: User) => {
        const user = res;
        if (user) {
          this.setCurrentUser(user)
        }
      })
    );
  }

  public login(model: any): Observable<void> {
    return this.http.post<User>(`${this.baseURL}/login`, model).pipe(
      take(1),
      map((res: User) => {
        const user = res;
        if (user) this.setCurrentUser(user);
      })
    );
  }

  public logout(): void {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.currentUserSource.complete();
  }

  public getUserById(): Observable<UserUpdate> {
    return this.http.get<UserUpdate>(`${this.baseURL}/usuarios/${this.decodeToken}`).pipe(take(1));
  }

  public updateUser(model: UserUpdate): Observable<void> {
    return this.http.put<UserUpdate>(`${this.baseURL}/usuarios/update/${this.decodeToken}`, model).pipe(
      take(1),
      map((user: UserUpdate) => {
        this.setCurrentUser(user);
      })
    );
  }

  public setCurrentUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
    this.currentUserSource.complete();
  }

}
