import { ImgurApiService } from './../../services/imgur-api-service.service';
import { Filiado } from './../../models/Filiado';
import { Mestre } from './../../models/Mestre';
import { HomeService } from './../../services/home.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Evento } from '@app/models/Evento';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import SwiperCore, { FreeMode, Navigation, Thumbs, Pagination } from "swiper";
SwiperCore.use([FreeMode, Navigation, Thumbs, Pagination]);
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  public eventos: Evento[] = [];
  public mestres: Mestre[] = [];
  public mestresDN: Mestre[] = [];
  public mestresDE: Mestre[] = [];
  public filiados: Filiado[] = [];
  public imagemImgur = '';
  thumbsSwiper: any;
  tipo: string;

  constructor(
    private homeService: HomeService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private imgurService: ImgurApiService
  ) {  }

  ngOnInit(): void {
    this.carregaEventos();
    this.carregaMestres();
    this.carregaFiliados();
  }

  public mostraImagem(imagem: string): string {
    return (imagem && imagem !== '')
    ? `${imagem}`
    : 'assets/img/sem-imagem.png';
  }

  public carregaEventos(): void {
    this.spinner.show();
    this.homeService.getEventos()
    .subscribe((eventos: Evento[])=> {
      this.eventos = eventos;
     },
     error => {
      this.spinner.hide();
      this.toastr.error('Erro ao carregar os eventos.', 'Erro!')
      console.error(error);
    },
    () => this.spinner.hide()
    )
  }

  public carregaMestres(): void {
    this.spinner.show();
    this.homeService.getDiretorias()
    .subscribe((mestres: Mestre[])=> {
      this.mestres = mestres;
      mestres.forEach((value, index) => {
        if(value.tipo === 'DN') this.mestresDN[index] = value;
        else this.mestresDE[index] = value;
      })
      this.mestresDN = this.mestresDN.filter(i => { return i });
      this.mestresDE = this.mestresDE.filter(i => { return i });
     },
     error => {
      this.spinner.hide();
      this.toastr.error('Erro ao carregar os mestres.', 'Erro!')
      console.error(error);
    },
    () => this.spinner.hide()
    )
  }

  public carregaFiliados(): void {
    this.spinner.show();
    this.homeService.getFiliados()
    .subscribe((filiados: Filiado[])=> {
      this.filiados = filiados;
     },
     error => {
      this.spinner.hide();
      this.toastr.error('Erro ao carregar os filiados.', 'Erro!')
      console.error(error);
    },
    () => this.spinner.hide()
    )
  }
}


