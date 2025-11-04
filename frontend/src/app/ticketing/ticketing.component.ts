import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable, timer, interval } from 'rxjs';
import { switchMap, map, retryWhen } from 'rxjs/operators';
import { format, fromUnixTime } from 'date-fns';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { AppSettings } from '../app.settings';

interface User {
  name: string;
  schedule: Array<{ room: string }>;
  auths: Array<{ reader: string }>;
}

interface ApiResponse {
  users: User[];
  timestamp: number;
}

@Component({
  selector: 'app-ticketing',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './ticketing.component.html',
  styleUrls: ['./ticketing.component.scss'],
})
export class TicketingComponent {
  private httpClient = inject(HttpClient);

  public usersAbsent$: Observable<User[]>;
  public usersPresent$: Observable<User[]>;
  public timestamp$: Observable<string>;
  public presentCount$: Observable<number>;
  public absentCount$: Observable<number>;
  displayedColumns: string[] = ['name', 'room'];

  constructor() {
    const interval$ = timer(0, 3000);
    const data$ = interval$.pipe(
      switchMap(() =>
        this.httpClient.get<ApiResponse>(AppSettings.APIENDPOINT_USERS)
      ),
      retryWhen(() => interval(3000)),
    );
    
    const users$ = data$.pipe(map(({ users }) => users));
    
    this.timestamp$ = data$.pipe(
      map(({ timestamp }) =>
        format(fromUnixTime(timestamp), AppSettings.DATE_FORMAT)
      ),
    );
    
    this.usersPresent$ = users$.pipe(
      map(users => users.filter(this.isPresent)),
    );
    
    this.usersAbsent$ = users$.pipe(
      map(users => users.filter(this.isAbsent))
    );

    this.presentCount$ = this.usersPresent$.pipe(
      map(users => users.length)
    );

    this.absentCount$ = this.usersAbsent$.pipe(
      map(users => users.length)
    );
  }

  public splitUsers(users: User[] | null, number: number): User[] {
    if (!users) {
      return [];
    }
    const mid = Math.ceil(users.length / 2);
    return number === 1 ? users.slice(0, mid) : users.slice(mid);
  }

  private isPresent(user: User): boolean {
    return (
      user.auths.length > 0 &&
      user.auths[0].reader === AppSettings.TYPE_ACTION.INPUT
    );
  }

  private isAbsent(user: User): boolean {
    return (
      user.auths.length === 0 ||
      (user.auths.length > 0 &&
        user.auths[0].reader === AppSettings.TYPE_ACTION.OUTPUT)
    );
  }
}
