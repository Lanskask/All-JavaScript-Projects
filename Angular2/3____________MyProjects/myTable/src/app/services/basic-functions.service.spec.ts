import { TestBed, inject } from '@angular/core/testing';

import { BasicFunctionsService } from './basic-functions.service';

describe('BasicFunctionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BasicFunctionsService]
    });
  });

  it('should be created', inject([BasicFunctionsService], (service: BasicFunctionsService) => {
    expect(service).toBeTruthy();
  }));
});
