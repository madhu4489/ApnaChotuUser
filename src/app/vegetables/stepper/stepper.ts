import { Component, Input, EventEmitter, Output, OnInit } from "@angular/core";

@Component({
  selector: "stepper",
  templateUrl: "stepper.html"
})
export class StepperComponent implements OnInit{
  @Input() count: any;
  @Input() someText: any;
  
  @Output() countHandler = new EventEmitter();
  public menuOrder: string;
  public selectedOrder: any = [];

  constructor() {}

  ngOnInit(){
  }

  clickFn(val: any) {
    // this.count =
    //   val == 1 ? this.count + 1 : this.count - 1;
  
    this.countHandler.emit(this.count);
  }
}
