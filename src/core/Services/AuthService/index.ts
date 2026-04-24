/* eslint-disable prettier/prettier */
import blsCore from '../..';

export default class AuthService {
  endPoint: string;

  constructor() {
    this.endPoint = '/Auth';
  }

  login = async (userName: any, password: string): Promise<any> =>
    (await blsCore.api.request('post', `${this.endPoint}/Login`, { userName, password },)) as unknown as number;

  getUserList = async (): Promise<any[]> =>
    (await blsCore.api.request('get', `${this.endPoint}/GetUserList`,{})) as unknown as any[];

}
