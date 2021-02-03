import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-data-picker-dialog',
  templateUrl: './data-picker-dialog.component.html',
  styleUrls: ['./data-picker-dialog.component.css']
})
export class DataPickerDialogComponent implements OnInit {

  public country = "";
  public state = "";

  @Output()
  passEntry: EventEmitter<any> = new EventEmitter();

  @Input()
  public locationsStored: {};
  @Input()
  public opennedFrom: String;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    // no location is sent
    // if (this.isEmptyObject(this.locationsStored)) {
    //   this.passEntry.emit({ 'error': "locations not found" })
    // }
  }

  submitChoices() {
    var choicesMade = {
      country: this.country,
      state: this.state,
      openningSrc: this.opennedFrom
    }
    console.log("choices to be emitted");
    console.log(JSON.stringify(choicesMade));
    this.passEntry.emit(choicesMade);
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }



}
