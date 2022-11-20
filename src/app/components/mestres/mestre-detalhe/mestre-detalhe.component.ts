import { MestreService } from './../../../services/mestre.service';
import { Mestre } from './../../../models/Mestre';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-mestre-detalhe',
  templateUrl: './mestre-detalhe.component.html',
  styleUrls: ['./mestre-detalhe.component.scss']
})
export class MestreDetalheComponent implements OnInit {
  modalRef: BsModalRef;
  form!: FormGroup;
  mestre = {} as Mestre;
  estadoSalvar = 'post';
  mestreId: string;
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
    private mestreService: MestreService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: BsModalService,
  ) {
    this.localeService.use('pt-br')
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
            this.form.patchValue(this.mestre);

            if (this.mestre.imagem !== '') {
              this.imagemURL = '../../../../assets/img/sem-imagem.png';
            }
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
      imagemUrl: ['']
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
        (res: any) => {
          this.toastr.success('Mestre salvo com sucesso!', 'Sucesso!');
          this.router.navigate([`/mestres/detalhe/${res.data._id}`]);
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

  onFileChange(ev: any): void {
    const reader = new FileReader();

    reader.onload = (event: any) => this.imagemURL = event.target.result;

    this.file = ev.target.files;
    reader.readAsDataURL(this.file[0]);

    this.uploadImagem();
  }

  uploadImagem(): void {
    this.spinner.show();
    this.mestreService.postUpload(this.mestreId, this.file)
      .subscribe(
        (res) => {
          this.carregarMestre();
          this.toastr.success('Imagem alterada com sucesso!', 'Sucesso!');
        },
        (error) => {
          this.toastr.error('Erro ao alterar imagem. Tente novamente!', 'Erro!');
        }
      ).add(() => this.spinner.hide());
  }
}
