import { ImgurApiService } from './../../../services/imgur-api-service.service';
import { MestreService } from './../../../services/mestre.service';
import { Mestre } from './../../../models/Mestre';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-mestre-detalhe',
  templateUrl: './mestre-detalhe.component.html',
  styleUrls: ['./mestre-detalhe.component.scss']
})
export class MestreDetalheComponent implements OnInit {
  form!: FormGroup;
  mestre = {} as Mestre;
  estadoSalvar = 'post';
  mestreId: string;
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
    private mestreService: MestreService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private imgurService: ImgurApiService
  ) {
    this.localeService.use('pt-br')
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

  public carregarMestre(): void {
    this.mestreId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.mestreId !== null && this.mestreId !== '') {
      this.spinner.show();

      this.estadoSalvar = 'put';

      this.mestreService.getMestreById(this.mestreId)
        .subscribe(
          (mestre: Mestre) => {
            this.mestre = { ...mestre };
            this.imagem = this.mestre.imagem ? this.mestre.imagem : this.imagem
            this.form.patchValue(this.mestre);
          },
          (error: any) => {
            this.toastr.error('Erro ao carregar mestre.', 'Erro!')
          },
          () => this.spinner.hide(),
        );
    }
  }

  ngOnInit(): void {
    this.validation();
    this.carregarMestre();
  }

  public validation(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      tipo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      descricao: ['', [Validators.required]],
      instagram: ['', [Validators.maxLength(15)]],
      imagem: ['']
    });
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  public salvarMestre(): void {
    if (this.form.valid) {
      this.spinner.show();
      this.mestre = (this.estadoSalvar === 'post') ? { ...this.form.value } : { _id: this.mestre._id, ...this.form.value };

      this.mestreService[this.estadoSalvar](this.mestre).subscribe(
        ({_id}) => {
          this.toastr.success('Mestre salvo com sucesso!', 'Sucesso!');
          this.estadoSalvar === 'post'
            ? this.router.navigate([`/mestres/detalhe/${_id}`])
            : this.router.navigate([`/mestres/detalhe/${this.mestre._id}`])
        },
        (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao salvar mestre.', 'Erro!');
        },
        () => this.spinner.hide(),
      );
    } else {
      this.toastr.error('Preencha os campos obrigatórios.', 'Erro!');
    }
  }
}
