/* eslint-disable semi */
/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
import blsCore from '../..';
import { FileByPathResponse, UploadFileRequest } from './interfaces';

export default class FileService {
  endPoint: string;

  constructor() {
    this.endPoint = '/File';
  }

  uploadFile = async (fileData:UploadFileRequest): Promise<any[]> =>
    (await blsCore.api.request('post', `${this.endPoint}/UploadFile`, fileData,)) as unknown as any[];
  
  getFileByOid = async (oid: number): Promise<any[]> =>
    (await blsCore.api.request('post', `${this.endPoint}/GetFileByOid`, {oid})) as unknown as any[];

  getFileByPath = async (FileUrl: string): Promise<FileByPathResponse> =>{
    try {
        const response = await blsCore.api.request('post', `${this.endPoint}/GetFileByPath`, {FileUrl}) 
        return response as unknown as FileByPathResponse;
    }
    catch (error){
        return null as unknown as FileByPathResponse;
    }
  }
    

}
