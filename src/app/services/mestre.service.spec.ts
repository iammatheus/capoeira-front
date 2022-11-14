/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MestreService } from './mestre.service';

describe('Service: Mestre', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MestreService]
    });
  });

  it('should ...', inject([MestreService], (service: MestreService) => {
    expect(service).toBeTruthy();
  }));
});
