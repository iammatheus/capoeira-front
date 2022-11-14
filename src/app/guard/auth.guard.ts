import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private toastr: ToastrService
  ){ }

  canActivate(): boolean {
    if(localStorage.getItem('user') !== null)
      return true;

    this.router.navigate(['/user/login']);
    this.toastr.info('Usuário não autenticado!');
    return false;
  }

}
