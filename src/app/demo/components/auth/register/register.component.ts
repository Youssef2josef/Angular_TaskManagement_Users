import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {

  routeItems!: MenuItem[];

  constructor() {}

  ngOnInit(){
    this.routeItems = [
      { label: 'Personal', routerLink: 'personal' },
      { label: 'Secret-info', routerLink: 'secret-info' },
      { label: 'Other-info', routerLink: 'other-info' },
      { label: 'Confirmation', routerLink: 'confirmation' },
    ];
  }

}
