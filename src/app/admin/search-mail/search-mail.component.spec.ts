import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMailComponent } from './search-mail.component';

describe('SearchMailComponent', () => {
  let component: SearchMailComponent;
  let fixture: ComponentFixture<SearchMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchMailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
