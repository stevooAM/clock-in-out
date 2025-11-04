import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AppSettings } from '../app.settings';

interface UserData {
  uid: string;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: 'user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

  users$: Observable<UserData[] | null>;
  userID = '';
  key = '';
  update$ = new BehaviorSubject(true);

  constructor() {
    this.users$ = this.update$.pipe(
      switchMap(() =>
        this.http.get<UserData[]>(AppSettings.APIENDPOINT_USER)
      ),
      map(users => (users.length === 0 ? null : users)),
    );
  }

  save(): void {
    if (!this.userID || !this.key) {
      this.snackBar.open('Please fill in all fields', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const user = {
      uid: this.userID,
      key: this.key,
    };

    this.http
      .post(AppSettings.APIENDPOINT_USER, user)
      .subscribe({
        next: () => {
          this.key = '';
          this.userID = '';
          this.update$.next(true);
          this.snackBar.open('User saved successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: () => {
          this.snackBar.open('Error saving user', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }
}
