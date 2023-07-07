import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {
  @Input() color: string = 'gray';
  @Input() text: string = 'Submit';
  @Output() btnClick = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    console.log(this.color);
    console.log(this.text);
  }

  onClick() {
    this.btnClick.emit();
  }
}
