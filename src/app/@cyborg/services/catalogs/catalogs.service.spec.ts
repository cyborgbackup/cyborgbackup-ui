import { TestBed } from '@angular/core/testing';

import { CatalogsService } from './catalogs.service';

describe('CatalogsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CatalogsService = TestBed.get(CatalogsService);
    expect(service).toBeTruthy();
  });
});
