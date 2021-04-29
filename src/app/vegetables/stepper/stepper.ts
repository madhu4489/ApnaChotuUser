import { Component, Input, EventEmitter, Output, OnInit } from "@angular/core";

@Component({
  selector: "stepper",
  templateUrl: "stepper.html"
})
export class StepperComponent implements OnInit{
  @Input() count: any;
  @Input() someText: any;
  @Input() priceQuantity: any;

  @Input() increment: boolean;
  
  
  @Output() countHandler = new EventEmitter();
  public menuOrder: string;
  public selectedOrder: any = [];

  constructor() {}

  ngOnInit(){
  }

  clickFn(val: any) {

    if(this.increment){
      this.countHandler.emit(val);
    }else{
      this.countHandler.emit(this.count);
    }
 
  }
}
