import {LongDatePipe} from './long-date.pipe';

describe('JobStatePipe', () => {
    it('create an instance', () => {
        const pipe = new LongDatePipe();
        expect(pipe).toBeTruthy();
    });
});
