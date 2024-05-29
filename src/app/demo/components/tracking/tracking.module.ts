import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular'; // import FullCalendarModule
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { TrackingRoutingModule } from './tracking-routing.module';
import { TrackingComponent } from './tracking/tracking.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';


@NgModule({
  declarations: [
    TrackingComponent
  ],
  imports: [
    CommonModule,
    TrackingRoutingModule,
    FullCalendarModule,
    ButtonModule,
    RippleModule,
    SplitButtonModule,
    ToggleButtonModule,
  ]
})
export class TrackingModule { }
