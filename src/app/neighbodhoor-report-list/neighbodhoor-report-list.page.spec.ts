import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NeighbodhoorReportListPage } from './neighbodhoor-report-list.page';

describe('NeighbodhoorReportListPage', () => {
  let component: NeighbodhoorReportListPage;
  let fixture: ComponentFixture<NeighbodhoorReportListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeighbodhoorReportListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NeighbodhoorReportListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
