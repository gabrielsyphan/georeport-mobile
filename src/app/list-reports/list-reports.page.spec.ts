import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListReportsPage } from './list-reports.page';

describe('ListReportsPage', () => {
  let component: ListReportsPage;
  let fixture: ComponentFixture<ListReportsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListReportsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListReportsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
