import {TestBed} from '@angular/core/testing';

import {PoliciesService} from './policies.service';

describe('JobsService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: PoliciesService = TestBed.get(PoliciesService);
        expect(service).toBeTruthy();
    });
});
