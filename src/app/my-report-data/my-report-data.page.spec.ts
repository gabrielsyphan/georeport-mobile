import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyReportDataPage } from './my-report-data.page';

describe('MyReportDataPage', () => {
  let component: MyReportDataPage;
  let fixture: ComponentFixture<MyReportDataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyReportDataPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyReportDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
