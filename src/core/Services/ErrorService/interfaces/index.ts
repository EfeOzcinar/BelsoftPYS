/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
export interface ErrorSaveRequest {
    id?: string;
    ErrorExplanation?: string;
    Priority?: string;
    CompanyOid?: number;
    ProjectOid?: number;
    ModuleOid?: number;
    ErrorStatusCode?: number;
    CreatedUserOid?: number;
    UpdatedDate?: number;
    UpdateUserOid?: number;
    DeletedDate?: number;
    DeleteUserOid?: number;
    ClosedDate?: number;
    CloseUserOid?: number;
    CompanyRequestOid?: number;
    ErrorNo?: number;
    ErrorTitle?: string;
    ClosedExplanation?: string;
    IsTaskClosed?: boolean;
    IsNeedCodeUpdate?: boolean;
    ErrorDocumentList? : ErrorDocument[];
    ErrorDetail?:ErrorDetail[];
    Oid?:number;
  }

  interface ErrorDetail {
    Description: string;
    CreatedUserOid: number;
    SendUserOid: number;
    ErrorStatusCode: number;
    InProgress: string;
    ErrorOid: number;
  }

  interface ErrorDocument {
    DeletedDate: number;
    ErrorOid: number;
    FileExplanation: string;
    FileDisplayName: string;
    FileName: string;
    OriginalFilename: string;
    FileExtension: string;
    FileUrl: string;
    ProjectOid: number;
    CreatedUserOid: number;
    DeletedUserOid: number;
    IsActive: true,
    ModuleName: string;
  }

  export interface SaveAssignErrorRequest {
    Description: string
    CreatedUserOid: number
    SendUserOid: number
    ErrorStatusCode: number
    InProgress: string
    ErrorOid: number
    Duration: number
  }

  export interface SaveAssignErrorResponse {
    Oid: number
    CreatedDate: number
    LastUpdatedDate: number
    Description: string
    CreatedUserOid: number
    SendUserOid: number
    ErrorStatusCode: number
    InProgress: string
    ErrorOid: number
    Duration: number
  }

  export interface CloseErrorRequest {
    ErrorOid: number
    ErrorStatusCode: number
    CloseUserOid: number
    Closedexplanation: string
    IsNeedCodeUpdate: boolean
  }
  
  export interface CloseErrorResponse {
    Oid: number
    CreatedDate: number
    LastUpdatedDate: number
    ErrorExplanation: string
    Priority: string
    CompanyOid: number
    ProjectOid: number
    ModuleOid: number
    ErrorStatusCode: number
    CreatedUserOid: number
    UpdatedDate: number
    UpdateUserOid: number
    DeletedDate: number
    DeleteUserOid: number
    ClosedDate: number
    CloseUserOid: number
    CompanyRequestOid: number
    ErrorNo: number
    ErrorTitle: string
    ClosedExplanation: string
    IsTaskClosed: boolean
    SendUserOid: number
    SenderUserOid: number
    IsNeedCodeUpdate: boolean
    ErrorDocumentList: ErrorDocumentList[]
    ErrorDetailList: ErrorDetailList[]
    ErrorNoteList: ErrorNoteList[]
  }

  interface ErrorDocumentList {
    Oid: number
    DeletedDate: number
    ErrorOid: number
    FileExplanation: string
    FileDisplayName: string
    FileName: string
    OriginalFileName: string
    FileExtension: string
    FileUrl: string
    ProjectOid: number
    CreatedUserOid: number
    DeletedUserOid: number
    IsActive: boolean
    ModuleName: string
  }
  
  export interface ErrorDetailList {
    Oid: number
    Description: string
    CreatedUserOid: number
    SendUserOid: number
    ErrorStatusCode: number
    InProgress: string
    ErrorOid: number
  }
  
  interface ErrorNoteList {
    Oid: number
    CreatedDate: number
    LastUpdatedDate: number
    DeletedDate: number
    ErrorOid: number
    CreatedUserOid: number
    UpdatedUserOid: number
    DeletedUserOid: number
    IsActive: boolean
    Note: string
  }

  export interface GetFavoriteInfoByErrorOidRequest {
    UserOid: number
    ErrorOid: number
  }

  export interface GetFavoriteInfoByErrorOidResponse {
    Oid: number
    CreatedDate: number
    LastUpdatedDate: number
    ErrorOid: number
    UserOid: number
    IsActive: boolean
  }

  export interface AddFavoriteErrorRequest {
    ErrorOid: number
    UserOid: number
    IsActive: boolean
  }
  
  export interface AddFavoriteErrorResponse {
    Oid: number
    CreatedDate: number
    LastUpdatedDate: number
    ErrorOid: number
    UserOid: number
    IsActive: boolean
  }