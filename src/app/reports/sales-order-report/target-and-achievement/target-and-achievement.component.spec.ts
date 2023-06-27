import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetAndAchievementComponent } from './target-and-achievement.component';

describe('TargetAndAchievementComponent', () => {
  let component: TargetAndAchievementComponent;
  let fixture: ComponentFixture<TargetAndAchievementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetAndAchievementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TargetAndAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
