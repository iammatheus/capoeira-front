import { MestresComponent } from './components/mestres/mestres.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { NgxCurrencyModule } from 'ngx-currency';

import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { PerfilComponent } from './components/user/perfil/perfil.component';
import { NavComponent } from './shared/nav/nav.component';
import { CarrouselComponent } from './shared/carrousel/carrousel.component';
import { TituloComponent } from './shared/titulo/titulo.component';
import { TituloContainerComponent } from './shared/titulo-container/titulo-container.component';
import { EventoDetalheComponent } from './components/eventos/evento-detalhe/evento-detalhe.component';
import { EventoListaComponent } from './components/eventos/evento-lista/evento-lista.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/user/login/login.component';

import { EventoService } from './services/evento.service';

import { DateTimeFormatPipe } from './helpers/DateTimeFormat.pipe';
import { AccountService } from './services/account.service';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { HomeComponent } from './components/home/home.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MestreService } from './services/mestre.service';
import { MestreDetalheComponent } from './components/mestres/mestre-detalhe/mestre-detalhe.component';
import { MestreListaComponent } from './components/mestres/mestre-lista/mestre-lista.component';

import { SwiperModule } from 'swiper/angular';
import { FiliadosComponent } from './components/filiados/filiados.component';
import { FiliadoDetalheComponent } from './components/filiados/filiado-detalhe/filiado-detalhe.component';
import { FiliadoListaComponent } from './components/filiados/filiado-lista/filiado-lista.component';
import { FiliadoService } from './services/filiado.service';

import { ImgurApiService } from './services/imgur-api-service.service';

defineLocale('pt-br', ptBrLocale);
@NgModule({
  declarations: [
    AppComponent,
    EventosComponent,
    NavComponent,
    TituloComponent,
    TituloContainerComponent,
    PerfilComponent,
    DateTimeFormatPipe,
    EventoDetalheComponent,
    EventoListaComponent,
    UserComponent,
    LoginComponent,
    HomeComponent,
    MestresComponent,
    MestreDetalheComponent,
    MestreListaComponent,
    CarrouselComponent,
    FiliadosComponent,
    FiliadoDetalheComponent,
    FiliadoListaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CollapseModule.forRoot(),
    TooltipModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    NgxSpinnerModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressBar: true
    }),
    FormsModule,
    ReactiveFormsModule,
    NgxCurrencyModule,
    SwiperModule
  ],
  providers: [
    EventoService,
    AccountService,
    MestreService,
    FiliadoService,
    ImgurApiService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
