import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppSettings } from '../app.settings';

interface User {
  uid: string;
  name: string;
  email?: string;
  phone?: string;
}

interface OtpResponse {
  message: string;
  code?: string;
}

interface AuthResponse {
  status: number;
  msg: string;
}

@Component({
  selector: 'app-clock-in-out',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './clock-in-out.component.html',
  styleUrls: ['./clock-in-out.component.scss'],
})
export class ClockInOutComponent {
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

  // User list
  users: User[] = [];
  loadingUsers = false;

  // Manual ID entry
  manualUserId = '';
  manualAction: 'in' | 'out' = 'in';
  manualLoading = false;

  // OTP authentication
  otpUserId = '';
  otpMethod: 'email' | 'sms' = 'email';
  otpAction: 'in' | 'out' = 'in';
  otpCode = '';
  otpRequested = false;
  otpRequesting = false;
  otpVerifying = false;
  otpCodeDisplayed = '';

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loadingUsers = true;
    this.http.get<{ users: User[] }>(AppSettings.APIENDPOINT_USERS).subscribe({
      next: (response) => {
        this.users = response.users;
        this.loadingUsers = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.showSnackBar('Error loading users', 'error');
        this.loadingUsers = false;
      },
    });
  }

  // Manual ID entry
  onManualSubmit() {
    if (!this.manualUserId.trim()) {
      this.showSnackBar('Please enter a user ID', 'error');
      return;
    }

    this.manualLoading = true;
    const endpoint =
      this.manualAction === 'in'
        ? AppSettings.APIENDPOINT_IN_MANUAL
        : AppSettings.APIENDPOINT_OUT_MANUAL;

    this.http
      .post<AuthResponse>(endpoint, {
        userId: this.manualUserId.trim(),
        reader: 'web',
      })
      .subscribe({
        next: (response) => {
          this.showSnackBar(response.msg, response.status === 1 ? 'success' : 'error');
          this.manualUserId = '';
          this.manualLoading = false;
        },
        error: (error) => {
          console.error('Error:', error);
          this.showSnackBar(
            error.error?.msg || 'Error processing request',
            'error',
          );
          this.manualLoading = false;
        },
      });
  }

  // OTP authentication
  onRequestOtp() {
    if (!this.otpUserId) {
      this.showSnackBar('Please select a user', 'error');
      return;
    }

    const selectedUser = this.users.find((u) => u.uid === this.otpUserId);
    if (!selectedUser) {
      this.showSnackBar('User not found', 'error');
      return;
    }

    if (this.otpMethod === 'email' && !selectedUser.email) {
      this.showSnackBar('User email not configured', 'error');
      return;
    }

    if (this.otpMethod === 'sms' && !selectedUser.phone) {
      this.showSnackBar('User phone not configured', 'error');
      return;
    }

    this.otpRequesting = true;
    this.http
      .post<OtpResponse>(AppSettings.APIENDPOINT_OTP_REQUEST, {
        userId: this.otpUserId,
        type: this.otpAction,
        method: this.otpMethod,
      })
      .subscribe({
        next: (response) => {
          this.otpRequested = true;
          this.otpRequesting = false;
          if (response.code) {
            // Development mode - show code
            this.otpCodeDisplayed = response.code;
            this.showSnackBar(
              `OTP sent! Code: ${response.code} (Dev mode)`,
              'success',
            );
          } else {
            this.showSnackBar(
              `OTP sent to ${this.otpMethod === 'email' ? selectedUser.email : selectedUser.phone}`,
              'success',
            );
          }
        },
        error: (error) => {
          console.error('Error requesting OTP:', error);
          this.showSnackBar(
            error.error?.message || 'Error requesting OTP',
            'error',
          );
          this.otpRequesting = false;
        },
      });
  }

  onVerifyOtp() {
    if (!this.otpCode.trim()) {
      this.showSnackBar('Please enter OTP code', 'error');
      return;
    }

    this.otpVerifying = true;
    const endpoint =
      this.otpAction === 'in'
        ? AppSettings.APIENDPOINT_IN_OTP
        : AppSettings.APIENDPOINT_OUT_OTP;

    this.http
      .post<AuthResponse>(endpoint, {
        code: this.otpCode.trim(),
        reader: 'web',
      })
      .subscribe({
        next: (response) => {
          this.showSnackBar(response.msg, response.status === 1 ? 'success' : 'error');
          this.resetOtpForm();
          this.otpVerifying = false;
        },
        error: (error) => {
          console.error('Error verifying OTP:', error);
          this.showSnackBar(
            error.error?.msg || 'Invalid or expired OTP code',
            'error',
          );
          this.otpVerifying = false;
        },
      });
  }

  resetOtpForm() {
    this.otpCode = '';
    this.otpRequested = false;
    this.otpCodeDisplayed = '';
  }

  getSelectedUser() {
    return this.users.find((u) => u.uid === this.otpUserId);
  }

  showSnackBar(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar'],
    });
  }
}

