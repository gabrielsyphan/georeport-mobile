import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OnlineReportDataPage } from './online-report-data.page';

describe('OnlineReportDataPage', () => {
  let component: OnlineReportDataPage;
  let fixture: ComponentFixture<OnlineReportDataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineReportDataPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OnlineReportDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
