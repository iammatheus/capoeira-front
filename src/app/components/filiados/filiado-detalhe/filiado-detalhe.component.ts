import { environment } from './../../../../environments/environment.prod';
import { Filiado } from './../../../models/Filiado';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { FiliadoService } from '../../../services/filiado.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ImgurApiService } from '../../../services/imgur-api-service.service';
@Component({
  selector: 'app-filiado-detalhe',
  templateUrl: './filiado-detalhe.component.html',
  styleUrls: ['./filiado-detalhe.component.scss']
})
export class FiliadoDetalheComponent implements OnInit {
  modalRef: BsModalRef;
  form!: FormGroup;
  filiado = {} as Filiado;
  estadoSalvar = 'post';
  filiadoId: string;
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
    private filiadoService: FiliadoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private imgurService: ImgurApiService
  ) {
    this.localeService.use('pt-br')
  }

  onChange(file: any) {
    this.imgurService.upload(file.target.files[0])
      .subscribe(res => console.log(res));
  }

  public carregarFiliado(): void {
    this.filiadoId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.filiadoId !== null && this.filiadoId !== '') {
      this.spinner.show();

      this.estadoSalvar = 'put';

      this.filiadoService.getFiliadoById(this.filiadoId)
        .subscribe(
          (filiado: Filiado) => {
            this.filiado = { ...filiado['filiado'] };
            this.form.patchValue(this.filiado);

            if (this.filiado.imagemUrl !== '') {
              this.imagemURL = `${environment.apiURL}resources/images/${this.filiado.imagemUrl}`;
            }
          },
          (error: any) => {
            this.toastr.error('Erro ao carregar filiado.', 'Erro!')
          },
          () => this.spinner.hide(),
        );
    }
  }

  ngOnInit(): void {
    this.validation();
    this.carregarFiliado();
  }

  public validation(): void {
    this.form = this.fb.group({
      nome: [''],
      imagemUrl: ['']
    });
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  public salvarFiliado(): void {
    if (this.form.valid) {
      this.spinner.show();
      this.filiado = (this.estadoSalvar === 'post') ? { ...this.form.value } : { _id: this.filiado._id, ...this.form.value };

      this.filiadoService[this.estadoSalvar](this.filiado).subscribe(
        ({ _id }: Filiado) => {
          this.toastr.success('Filiado salvo com sucesso!', 'Sucesso!');
          this.router.navigate([`/filiados/detalhe/${_id}`])
        },
        (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao salvar filiado.', 'Erro!');
        },
        () => this.spinner.hide(),
      );
    }
  }

  onFileChange(ev: any): void {
    const reader = new FileReader();

    reader.onload = (event: any) => this.imagemURL = event.target.result;

    this.file = ev.target.files;
    reader.readAsDataURL(this.file[0]);

    this.uploadImagem();
  }

  uploadImagem(): void {
    this.spinner.show();
    this.filiadoService.postUpload(this.filiadoId, this.file)
      .subscribe(
        (res) => {
          this.carregarFiliado();
          this.toastr.success('Imagem alterada com sucesso!', 'Sucesso!');
        },
        (error) => {
          this.toastr.error('Erro ao alterar imagem. Tente novamente!', 'Erro!');
        }
      ).add(() => this.spinner.hide());
  }

}
