import { Routes } from '@angular/router';
import { TicketingComponent } from './ticketing/ticketing.component';
import { UserComponent } from './user/user.component';
import { ClockInOutComponent } from './clock-in-out/clock-in-out.component';

export const routes: Routes = [
  {
    path: '',
    component: TicketingComponent,
  },
  {
    path: 'user',
    component: UserComponent,
  },
  {
    path: 'clock',
    component: ClockInOutComponent,
  },
];

