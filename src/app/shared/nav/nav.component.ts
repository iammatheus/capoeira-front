import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@app/services/account.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  isCollapsed = true;
  nome: string;

  getNome() {
    const token = localStorage.getItem('user');
    if(!token) return null;
    this.nome = token ? token['nome'] : 'Admin';
  }

  constructor(
    private router: Router,
    public accountService: AccountService,
  ) { }

  ngOnInit() { this.getNome() }

  logout(): void {
    this.accountService.logout();
    this.router.navigateByUrl('/user/login');
  }

  showMenu(): boolean {
    return this.router.url !== '/user/login';
  }

  smoothScrollMenu($event: any, id: string) {
    $event.preventDefault();
    document.getElementById(id).scrollIntoView();

    const titleH2 = document.getElementsByTagName('h2');

    for(let i = 0; i < titleH2.length; i++) {
      titleH2[i].style.marginTop = '60px'
    }
  }
}
