import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentHomeComponent } from './agent-home.component';

describe('AgentHomeComponent', () => {
  let component: AgentHomeComponent;
  let fixture: ComponentFixture<AgentHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
