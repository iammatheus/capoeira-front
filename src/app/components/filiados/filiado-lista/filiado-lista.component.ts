import { debounceTime } from 'rxjs/operators';
import { FiliadoService } from './../../../services/filiado.service';
import { PaginatedResult, Pagination } from './../../../models/Pagination';
import { Filiado } from './../../../models/Filiado';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-filiado-lista',
  templateUrl: './filiado-lista.component.html',
  styleUrls: ['./filiado-lista.component.scss']
})
export class FiliadoListaComponent implements OnInit {

  modalRef?: BsModalRef;

  public filiados: Filiado[] = [];
  public filiadoId = '';
  public filiadoNome = '';
  public largImg = 100;
  public altImg = 75;
  public margemImg = 2;
  public exibirImg = true;
  public pagination = {} as Pagination;

  termoBuscaChanged: Subject<string> = new Subject<string>();

  constructor(
    private filiadoService: FiliadoService,
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
    this.carregarFiliados();
  }

  public mostraImagem(imagem: string): string {
    return (imagem && imagem !== '')
    ? `${imagem}`
    : '../../../../assets/img/sem-imagem.png';
  }

  public carregarFiliados(): void {
    this.spinner.show();

    this.filiadoService.getFiliados(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe((res: PaginatedResult<Filiado[]>) => {
        this.filiados = res.result['data'];
        this.pagination = res.result['pagination'];
      },
        error => {
          this.spinner.hide();
          this.toastr.error('Erro ao carregar os filiados.', 'Erro!')
        },
        () => this.spinner.hide()
      );
  }

  public filtrarFiliados(filiado: any): void {
    if (this.termoBuscaChanged.observers.length === 0) {
      this.termoBuscaChanged.pipe(debounceTime(1000)).subscribe(
        filtrarPor => {
          this.spinner.show();
          this.filiadoService.getFiliados(
            this.pagination.currentPage,
            this.pagination.itemsPerPage,
            filtrarPor
          ).subscribe(
            (res: PaginatedResult<Filiado[]>) => {
              this.filiados = res.result['data'];
              this.pagination = res.result['pagination'];
            },
            error => {
              this.spinner.hide();
              this.toastr.error('Erro ao carregar os filiados.', 'Erro!');
              console.error(error);
            },
            () => this.spinner.hide()
          );
        }
      )
    }
    this.termoBuscaChanged.next(filiado.value);
  }

  public exibirImagem(): void {
    this.exibirImg = !this.exibirImg;
  }

  openModal(event: any, template: TemplateRef<any>, filiadoId: string, filiadoNome: string): void {
    event.stopPropagation();
    this.filiadoId = filiadoId;
    this.filiadoNome = filiadoNome;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.spinner.show();
    this.modalRef?.hide();
    this.filiadoService.deleteFiliado(this.filiadoId).subscribe(
      (res: any) => {
        if (res.message === 'Deletado') {
          this.carregarFiliados();
          this.toastr.success('Filiado deletado.', 'Sucesso!');
        }
      },
      (error: any) => {
        this.toastr.error(`Erro ao tentar deletar o filiado ${this.filiadoId}`, 'Erro!');
      }
    ).add(() => this.spinner.hide());
  }

  decline(): void {
    this.modalRef?.hide();
  }

  detalheFiliado(id: string): void {
    this.router.navigate([`filiados/detalhe/${id}`]);
  }

  public pageChanged($event: any): void {
    this.pagination.currentPage = $event.page;
    this.carregarFiliados();
  }

}
