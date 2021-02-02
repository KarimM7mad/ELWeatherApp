import { Component, OnInit, Input, Output } from '@angular/core';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-data-picker-dialog',
  templateUrl: './data-picker-dialog.component.html',
  styleUrls: ['./data-picker-dialog.component.css']
})
export class DataPickerDialogComponent implements OnInit {

  @Output()
  public formResults = { country: '', state: '', city: '' };

  public locationsStored: {};

  public openningSrcId: String;

  constructor(public activeModal: NgbActiveModal) {

  }

  ngOnInit(): void {
    this.locationsStored = JSON.parse(localStorage.getItem('locations'));
  }

  closeModal() {
    console.log(JSON.stringify(this.formResults));
    this.activeModal.close(this.formResults);
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }



}
