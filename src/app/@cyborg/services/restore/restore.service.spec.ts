import {TestBed} from '@angular/core/testing';

import {RestoreService} from './restore.service';

describe('RestoreService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: RestoreService = TestBed.get(RestoreService);
        expect(service).toBeTruthy();
    });
});
