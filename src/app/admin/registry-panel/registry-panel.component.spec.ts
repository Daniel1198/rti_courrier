import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryPanelComponent } from './registry-panel.component';

describe('RegistryPanelComponent', () => {
  let component: RegistryPanelComponent;
  let fixture: ComponentFixture<RegistryPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistryPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistryPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
