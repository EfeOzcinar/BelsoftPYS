/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
import blsCore from '../..';
import { AddFavoriteErrorRequest, AddFavoriteErrorResponse, CloseErrorRequest, CloseErrorResponse, ErrorSaveRequest, GetFavoriteInfoByErrorOidRequest, GetFavoriteInfoByErrorOidResponse, SaveAssignErrorRequest, SaveAssignErrorResponse } from './interfaces';

export default class ErrorService {
  endPoint: string;

  constructor() {
    this.endPoint = '/Error';
  }

  saveError = async (errorDto:ErrorSaveRequest): Promise<any> =>
    (await blsCore.api.request('post', `${this.endPoint}/SaveError`, errorDto,)) as unknown as any;
  
  getErrorInfo = async (errorOid: number): Promise<any> =>
    (await blsCore.api.request('post', `${this.endPoint}/GetErrorInfo`, {ErrorOid:errorOid})) as unknown as any;

  saveAssignError = async (saveData: SaveAssignErrorRequest): Promise<SaveAssignErrorResponse[]> =>
    (await blsCore.api.request('post', `${this.endPoint}/SaveAssignError`, saveData)) as unknown as SaveAssignErrorResponse[];

  closeError = async (saveData: CloseErrorRequest): Promise<CloseErrorResponse[]> =>
    (await blsCore.api.request('post', `${this.endPoint}/CloseError`, saveData)) as unknown as CloseErrorResponse[];

  getFavoriteInfoByErrorOid = async (queryData: GetFavoriteInfoByErrorOidRequest): Promise<GetFavoriteInfoByErrorOidResponse> =>
    (await blsCore.api.request('post', `${this.endPoint}/GetFavoriteInfoByErrorOid`, queryData)) as unknown as GetFavoriteInfoByErrorOidResponse;
  
  addFavoriteError = async (data: AddFavoriteErrorRequest): Promise<AddFavoriteErrorResponse> =>
    (await blsCore.api.request('post', `${this.endPoint}/AddFavoriteError`, data)) as unknown as AddFavoriteErrorResponse;
}
