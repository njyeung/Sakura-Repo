import { TestBed } from '@angular/core/testing';
import { BackdoorService } from './backdoor.service';


describe('BackdoorService', () => {
  let service: BackdoorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackdoorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
