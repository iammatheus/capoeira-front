import { environment } from './../../../../environments/environment.prod';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

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
  imagemURL = 'assets/img/upload.png';
  file: File;

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
    private modalService: BsModalService,
  ) {
    this.localeService.use('pt-br')
  }

  public carregarEvento(): void {
    this.eventoId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.eventoId !== null && this.eventoId !== '') {
      this.spinner.show();
      this.estadoSalvar = 'put';
      this.eventoService.getEventoById(this.eventoId)
        .subscribe(
          (evento: Evento) => {
            this.evento = { ...evento['evento'] };
            this.form.patchValue(this.evento['evento']);
            if(this.evento.imagemUrl !== ''){
              this.imagemURL = `${environment.apiURL}resources/images/${this.evento.imagemUrl}`;
            }
          },
          (error: any) => {
            this.toastr.error('Erro ao carregar evento.', 'Erro!')
            this.spinner.hide()
          },
          () => this.spinner.hide(),
        );
    }
  }

  ngOnInit(): void {
    this.validation();
    this.carregarEvento();
  }

  public validation(): void {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      descricao: [''],
      local: ['', [Validators.required]],
      dataEvento: ['', [Validators.required]],
      telefone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(11)]],
      email: ['', [Validators.required, Validators.email]],
      imagemUrl: ['']
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
        ({ _id }: Evento) => {
          this.toastr.success('Evento salvo com sucesso!', 'Sucesso!');
          this.router.navigate([`/eventos/detalhe/${_id}`]);
        },
        (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao salvar evento.', 'Erro!');
          console.error(error)
        },
        () => this.spinner.hide(),
      );
    }
  }

  imageFile(str: string): boolean {
    const regex = /.*\.(jpe?g|png)$/g;

    if(regex.test(str)) return true;

    return false;
  }

  onFileChange(ev: any): void{
    const reader = new FileReader();

    this.file = ev.target.files;
    reader.readAsDataURL(this.file[0]);

    if(this.imageFile(this.file[0].name)){
      this.uploadImagem();
      reader.onload = (event: any) => this.imagemURL = event.target.result;
    }else {
      this.toastr.warning('Tente: png, jpg ou jpeg.', 'Formato inválido!');
    }
  }

  uploadImagem(): void {
    this.spinner.show();
    this.eventoService.postUpload(this.eventoId, this.file)
      .subscribe(
        (res) => {
          this. carregarEvento();
          this.toastr.success('Imagem alterada com sucesso!', 'Sucesso!');
        },
        (error) => {
          this.toastr.error('Erro ao alterar imagem. Tente novamente!', 'Erro!');
        }
      ).add(() => this.spinner.hide());
  }
}

