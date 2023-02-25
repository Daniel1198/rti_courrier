import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAttachmentsComponent } from './show-attachments.component';

describe('ShowAttachmentsComponent', () => {
  let component: ShowAttachmentsComponent;
  let fixture: ComponentFixture<ShowAttachmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAttachmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
