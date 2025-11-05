export class RequestOtpDto {
  readonly userId: string;
  readonly type: 'in' | 'out';
  readonly method: 'email' | 'sms';
}

