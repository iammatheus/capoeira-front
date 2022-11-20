import { ImgurApiService } from './../../../services/imgur-api-service.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {
  modalRef: BsModalRef;
  form!: FormGroup;
  evento = {} as Evento;
  estadoSalvar = 'post';
  eventoId: string;
  imagem = 'assets/img/upload.png';


  get modoEditar(): boolean {
    return this.estadoSalvar === 'put';
  }

  get controls(): any {
    return this.form.controls;
  }

  get bsConfig(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY HH:mm',
      containerClass: 'theme-default',
      showWeekNumbers: false
    }
  }

  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private activatedRoute: ActivatedRoute,
    private eventoService: EventoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private imgurService: ImgurApiService
  ) {
    this.localeService.use('pt-br')
  }

  ngOnInit(): void {
    this.validation();
    this.carregarEvento();
  }

  onChange(file: any) {
    this.spinner.show()
    this.imgurService.upload(file.target.files[0]).subscribe(
      (res) => {
        this.form.value.imagem = res['data'].link;
        this.imagem = res['data'].link;
        this.toastr.success('Imagem carregada.', 'Sucesso!');
      },
      (error: any) => {
        this.toastr.error('Erro ao carregar imagem.', 'Erro!');
        console.error(error);
        this.spinner.hide();
      },
      () => this.spinner.hide(),
    )
  }

  public carregarEvento(): void {
    this.eventoId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.eventoId !== null && this.eventoId !== '') {
      this.spinner.show();
      this.estadoSalvar = 'put';
      this.eventoService.getEventoById(this.eventoId)
        .subscribe(
          (evento: Evento) => {
            this.evento = { ...evento };
            this.imagem = this.evento.imagem ? this.evento.imagem : this.imagem
            this.form.patchValue(this.evento);
          },
          (error: any) => {
            this.toastr.error('Erro ao carregar evento.', 'Erro!')
            this.spinner.hide()
          },
          () => this.spinner.hide(),
        );
    }
  }

  public validation(): void {
    this.form = this.fb.group({
      titulo: ['', [Validators.required]],
      descricao: [''],
      local: ['', [Validators.required]],
      dataEvento: ['', [Validators.required]],
      telefone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(11)]],
      email: ['', [Validators.required, Validators.email]],
      imagem: ['']
    });
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  public salvarEvento(): void {
    if (this.form.valid) {
      this.spinner.show();
      this.evento = (this.estadoSalvar === 'post') ? { ...this.form.value } : { _id: this.evento._id, ...this.form.value };
      this.eventoService[this.estadoSalvar](this.evento).subscribe(
        ({_id}) => {
          this.toastr.success('Evento salvo com sucesso!', 'Sucesso!');
          this.estadoSalvar === 'post'
            ? this.router.navigate([`/eventos/detalhe/${_id}`])
            : this.router.navigate([`/eventos/detalhe/${this.evento._id}`])
        },
        (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao salvar evento.', 'Erro!');
          console.error(error)
        },
        () => this.spinner.hide(),
      );
    } else {
      this.toastr.error('Preencha os campos obrigatórios.', 'Erro!');
    }
  }

}

