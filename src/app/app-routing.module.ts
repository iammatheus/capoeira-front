import { FiliadosComponent } from './components/filiados/filiados.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EventoDetalheComponent } from './components/eventos/evento-detalhe/evento-detalhe.component';
import { EventoListaComponent } from './components/eventos/evento-lista/evento-lista.component';
import { EventosComponent } from './components/eventos/eventos.component';

import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/user/login/login.component';
import { PerfilComponent } from './components/user/perfil/perfil.component';

import { AuthGuard } from './guard/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { MestresComponent } from './components/mestres/mestres.component';
import { MestreDetalheComponent } from './components/mestres/mestre-detalhe/mestre-detalhe.component';
import { MestreListaComponent } from './components/mestres/mestre-lista/mestre-lista.component';
import { FiliadoDetalheComponent } from './components/filiados/filiado-detalhe/filiado-detalhe.component';
import { FiliadoListaComponent } from './components/filiados/filiado-lista/filiado-lista.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'user', redirectTo: 'user/perfil' },
      { path: 'user/perfil', component: PerfilComponent },

      { path: 'eventos', redirectTo: 'eventos/lista' },
      {
        path: 'eventos', component: EventosComponent,
        children: [
          { path: 'detalhe/:id', component: EventoDetalheComponent },
          { path: 'detalhe', component: EventoDetalheComponent },
          { path: 'lista', component: EventoListaComponent }
        ]
      },
      { path: 'mestres', redirectTo: 'mestres/lista' },
      {
        path: 'mestres', component: MestresComponent,
        children: [
          { path: 'detalhe/:id', component: MestreDetalheComponent },
          { path: 'detalhe', component: MestreDetalheComponent },
          { path: 'lista', component: MestreListaComponent }
        ]
      },
      { path: 'filiados', redirectTo: 'filiados/lista' },
      {
        path: 'filiados', component: FiliadosComponent,
        children: [
          { path: 'detalhe/:id', component: FiliadoDetalheComponent },
          { path: 'detalhe', component: FiliadoDetalheComponent },
          { path: 'lista', component: FiliadoListaComponent }
        ]
      },
    ]
  },

  {
    path: 'user', component: UserComponent,
    children: [
      { path: 'login', component: LoginComponent },
    ]
  },

  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
