import { environment } from '../environments/environment';

export class AppSettings {
  static readonly TYPE_ACTION = {
    INPUT: 'input',
    OUTPUT: 'output',
  };
  static readonly DATE_FORMAT = 'DD/MM/YYYY HH:mm:ss';
  static readonly APIENDPOINT = environment.APIENDPOINT_BACKEND;
  static readonly APIENDPOINT_USER = `${AppSettings.APIENDPOINT}/user`;
  static readonly APIENDPOINT_USERS = `${AppSettings.APIENDPOINT}/users`;
  static readonly APIENDPOINT_IN = `${AppSettings.APIENDPOINT}/in`;
  static readonly APIENDPOINT_OUT = `${AppSettings.APIENDPOINT}/out`;
  static readonly APIENDPOINT_IN_OTP = `${AppSettings.APIENDPOINT}/in/otp`;
  static readonly APIENDPOINT_OUT_OTP = `${AppSettings.APIENDPOINT}/out/otp`;
  static readonly APIENDPOINT_IN_MANUAL = `${AppSettings.APIENDPOINT}/in/manual`;
  static readonly APIENDPOINT_OUT_MANUAL = `${AppSettings.APIENDPOINT}/out/manual`;
  static readonly APIENDPOINT_OTP_REQUEST = `${AppSettings.APIENDPOINT}/otp/request`;
}
