import { ImgurApiService } from './../../services/imgur-api-service.service';
import { Component, ViewEncapsulation, Input, OnInit } from '@angular/core';

import SwiperCore, { FreeMode, Navigation, Thumbs } from "swiper";
SwiperCore.use([FreeMode, Navigation, Thumbs]);

@Component({
  selector: 'app-carrousel',
  templateUrl: './carrousel.component.html',
  styleUrls: ['./carrousel.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CarrouselComponent implements OnInit {

  @Input() titulo: string;
  @Input() itens: any;
  @Input() id?: number;
  thumbsSwiper: any;

  constructor(private ImgurApiService: ImgurApiService) { }

  ngOnInit() { }

  public mostraImagem(imagem: string): string {
    return (imagem && imagem !== '')
    ? `${imagem}`
    : '../../../assets/img/sem-imagem.png';
  }
  addClassFlexRowReverse(){
    return this.id ? 'flex-row-reverse' : '';
  }
}
