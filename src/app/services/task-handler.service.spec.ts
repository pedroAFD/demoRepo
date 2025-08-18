import { TestBed } from '@angular/core/testing';

import { TaskHandlerService } from './task-handler.service';

describe('TaskHandlerService', () => {
  let service: TaskHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
