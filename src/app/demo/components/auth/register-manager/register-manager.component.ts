import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-register-manager',
  templateUrl: './register-manager.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./register-manager.component.css']
})
export class RegisterManagerComponent implements OnInit {

  routeItems!: MenuItem[];

  constructor() {}

  ngOnInit(){
    this.routeItems = [
      { label: 'Personal', routerLink: 'manager-personal' },
      { label: 'Secret-info', routerLink: 'manager-secret-info' },
      { label: 'Other-info', routerLink: 'manager-other-info' },
      { label: 'Confirmation', routerLink: 'manager-confirmation' },
    ];
  }

}
