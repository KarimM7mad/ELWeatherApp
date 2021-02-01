import { Component, OnInit, Input } from '@angular/core';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-data-picker-dialog',
  templateUrl: './data-picker-dialog.component.html',
  styleUrls: ['./data-picker-dialog.component.css']
})
export class DataPickerDialogComponent {

  public formResults = { country: '', state: '', city: '' };

  constructor(public activeModal: NgbActiveModal) { }

  closeModal() {
    this.activeModal.close(this.formResults);
  }


}
