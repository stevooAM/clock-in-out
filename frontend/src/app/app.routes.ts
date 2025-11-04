import { Routes } from '@angular/router';
import { TicketingComponent } from './ticketing/ticketing.component';
import { UserComponent } from './user/user.component';

export const routes: Routes = [
  {
    path: '',
    component: TicketingComponent,
  },
  {
    path: 'user',
    component: UserComponent,
  },
];

