import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombatTurnStatsComponent } from './combat-turn-stats.component';

describe('CombatTurnStatsComponent', () => {
  let component: CombatTurnStatsComponent;
  let fixture: ComponentFixture<CombatTurnStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombatTurnStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombatTurnStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
