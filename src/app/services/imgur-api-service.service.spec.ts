/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ImgurApiServiceService } from './imgur-api-service.service';

describe('Service: ImgurApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImgurApiServiceService]
    });
  });

  it('should ...', inject([ImgurApiServiceService], (service: ImgurApiServiceService) => {
    expect(service).toBeTruthy();
  }));
});
