import { take } from 'rxjs/operators';
import { AccountService } from './../services/account.service';
import { User } from '@app/models/Identity/User';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService: AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUser: User;
    const imgurUrl = 'https://api.imgur.com/3/image/';

    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      currentUser = user;
      if(currentUser && request.url !== imgurUrl){
        request = request.clone({
          setHeaders: {
            authorization: `${currentUser.token}`
          }
        })
      }
    });

    return next.handle(request);
  }
}
