/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FiliadoService } from './filiado.service';

describe('Service: Filiado', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FiliadoService]
    });
  });

  it('should ...', inject([FiliadoService], (service: FiliadoService) => {
    expect(service).toBeTruthy();
  }));
});
