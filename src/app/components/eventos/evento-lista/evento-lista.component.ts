import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {
  modalRef?: BsModalRef;

  public eventos: Evento[] = [];
  public eventoId = '';
  public eventoTitulo = '';
  public largImg = 100;
  public altImg = 75;
  public margemImg = 2;
  public exibirImg = true;
  public pagination = {} as Pagination;

  termoBuscaChanged: Subject<string> = new Subject<string>();

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 5,
      totalItems: 1
    } as Pagination;
    this.carregarEventos();
  }

  public mostraImagem(imagem: string): string {
    return (imagem && imagem !== '')
    ? `${imagem}`
    : 'assets/img/sem-imagem.png';
  }

  public carregarEventos(): void {
    this.spinner.show();

    this.eventoService.getEventos(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe((res: PaginatedResult<Evento[]>) => {
        this.eventos = res.result['data'];
        this.pagination = res.result['pagination'];
      },
      error => {
        this.spinner.hide();
        this.toastr.error('Erro ao carregar os eventos.', 'Erro!')
      },
      () => this.spinner.hide()
    );
  }

  public filtrarEventos(evento: any): void {
    if(this.termoBuscaChanged.observers.length === 0) {
      this.termoBuscaChanged.pipe(debounceTime(1000)).subscribe(
        filtrarPor => {
          this.spinner.show();
          this.eventoService.getEventos(
            this.pagination.currentPage,
            filtrarPor ? this.pagination.itemsPerPage : this.pagination.itemsPerPage = 5,
            filtrarPor
          ).subscribe(
            (res: PaginatedResult<Evento[]>) => {
              this.eventos = res.result['data'];
              this.pagination = res.result['pagination'];
            },
            error => {
              this.spinner.hide();
              this.toastr.error('Erro ao carregar os eventos.', 'Erro!');
              console.error(error);
            },
            () => this.spinner.hide()
          );
        }
      )
    }
    this.termoBuscaChanged.next(evento.value);
  }

  public exibirImagem(): void {
    this.exibirImg = !this.exibirImg;
  }

  openModal(event: any, template: TemplateRef<any>, eventoId: string, eventoTitulo: string): void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.eventoTitulo = eventoTitulo;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    this.spinner.show();
    this.modalRef?.hide();
    this.eventoService.deleteEvento(this.eventoId).subscribe(
      (res: any) => {
        if(res.message === 'Deletado'){
          this.carregarEventos();
          this.toastr.success('Evento deletado.', 'Sucesso!');
        }
      },
      (error: any) => {
        this.toastr.error(`Erro ao tentar deletar o evento ${this.eventoId}`, 'Erro!');
      }
    ).add(() => this.spinner.hide());
  }

  decline(): void {
    this.modalRef?.hide();
  }

  detalheEvento(id: string): void{
    this.router.navigate([`eventos/detalhe/${id}`]);
  }

  public pageChanged($event: any): void {
    this.pagination.currentPage = $event.page;
    this.carregarEventos();
  }
}
