import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPickerDialogComponent } from './data-picker-dialog.component';

describe('DataPickerDialogComponent', () => {
  let component: DataPickerDialogComponent;
  let fixture: ComponentFixture<DataPickerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataPickerDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPickerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
