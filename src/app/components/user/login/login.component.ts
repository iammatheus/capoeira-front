import { AccountService } from './../../../services/account.service';
import { UserLogin } from './../../../models/Identity/UserLogin';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  model = {} as UserLogin;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
  }

  public login(): void {
    this.spinner.show();

    this.accountService.login(this.model).subscribe(
      () => {
        this.router.navigate(['/home']);
      },
      (error: any) => {
        if (error.status == 401)
          this.toastr.error('Usuário ou senha inválidos.');
        else
          console.error('ERRO',error);

        this.spinner.hide();
      },
      () => this.spinner.hide()
    )
  }

}
