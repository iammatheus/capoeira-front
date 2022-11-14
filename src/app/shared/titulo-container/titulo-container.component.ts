import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-titulo-container',
  templateUrl: './titulo-container.component.html',
  styleUrls: ['./titulo-container.component.scss']
})
export class TituloContainerComponent implements OnInit {

  constructor() { }
  @Input() titulo: string;

  ngOnInit() {
  }

}
