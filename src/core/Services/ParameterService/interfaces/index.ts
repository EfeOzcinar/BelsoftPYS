/* eslint-disable prettier/prettier */
interface ProjectResponse {
  Oid: number;
  CreatedDate: number;
  LastUpdatedDate: number;
  IsActive: boolean;
  IsDefault: boolean;
  ProjectCode: string;
  ProjectName: string;
}

interface CompanyResponse {
  Oid: number;
  CreatedDate: number;
  CompanyCode: string;
  CompanyName: string;
}

interface ModuleListResponse {
  Oid: number;
  CreatedDate: number;
  LastUpdatedDate: number;
  ModuleName: string;
  ModuleCode: number;
  ParentModuleOid: number;
  IsActive: boolean;
}

interface ParentModulePesponse {
  Oid: number;
  CreatedDate: number;
  LastUpdatedDate: number;
  ModuleName: string;
  ModuleCode: number;
  ParentModuleOid: number;
  IsActive: boolean;
}

interface SaveModuleRequest {
  ModuleName: string;
  ModuleCode: string;
  ParentModuleOid: number;
  IsActive: boolean;
  ProjectOid?: number;
}

interface UpdateModuleRequest {
  Oid: number;
  ModuleName: string;
  ModuleCode: string;
  ParentModuleOid: number;
  IsActive: boolean;
  ProjectOid?: number;
}

interface GetGeneralParameterListResponse {
  Oid: number;
  CreatedDate: number;
  LastUpdatedDate: number;
  ParameterName: string;
  ParameterCode: number;
  ParameterTypeCode: number;
  IsActive: boolean;
}
interface GetAllFavoriteErrorsAndTasksResponse {
  Oid: number;
  CreatedDate: number;
  LastUpdatedDate: number;
  ParameterName: string;
  ParameterCode: number;
  ParameterTypeCode: number;
  IsActive: boolean;
}
interface GetErrorsAndTasksByPersonnelRequest {
  Oid: number;
  CreatedDate: number;
  LastUpdatedDate: number;
  ParameterName: string;
  ParameterCode: number;
  ParameterTypeCode: number;
  IsActive: boolean;
}
interface getUserTaskAndErrorListByCriteria {
  Oid: number;
  UserOid: number;
  CreatedDate: number;
  LastUpdatedDate: number;
  ParameterName: string;
  ParameterCode: number;
  ParameterTypeCode: number;
  IsActive: boolean;
  Type: string;
  StartDate: number;
  EndDate: number;
  Explanation: string;
}
interface getUserInfoByUserOid {
  Oid: number;
  UserOid: number;
}

interface getGeneralParameterList {
  Oid: number;
  CreatedDate: number;
  LastUpdatedDate: number;
  ParameterName: string;
  ParameterCode: number;
  ParameterTypeCode: number;
  IsActive: boolean;
  Type: string;
  StartDate: number;
  EndDate: number;
  Explanation: string;
  UserOid: number;
}

interface getErrorAndTaskListBasedUser {
  TaskOrErrorNumber: number;
  UserOid: number;
  StartDate: number;
  EndDate: number;
  Priority: string;
  CompanyOid: number;
  ProjectOid: number;
  StatusCode: number;
  CreatedUserOid: number;
  ClosedUserOid: number;
  IsTaksClosed: boolean;
  ShowClosedTask: boolean;
  IsActive: boolean;
  ModuleOidList: number[];
  AssignedUserOid?: number;
  DueDate?: number;
  Tags?: string[];
  SortBy?: string;
  PageSize?: number;
  PageNumber?: number;
  FilterType?: 'Today' | 'ThisWeek' | 'ThisMonth';
  ErrorType?: string;
  TaskType?: string;
  Description?: string;
  CreationDate?: number;
}

interface getAllErrorsAndTasks {
  TaskOrErrorNumber: number;
  UserOid: number;
  StartDate: number;
  EndDate: number;
  Priority: string;
  CompanyOid: number;
  ProjectOid: number;

  StatusCode: number;
  CreatedUserOid: number;
  ClosedUserOid: number;
  IsTaksClosed: boolean;
  ShowClosedTask: boolean;
  IsActive: boolean;
  ModuleOidList: [0];
}

export interface CompanyStatisticsResponse {
  Oid: number;
  Name: string
  StartDate: number
  EndDate: number
  ErrorCount: number
  ResolvedErrorCount: number
  TaskCount: number
  ResolvedTaskCount: number
}

export interface ModuleResponse {
  Oid: number
  CreatedDate: number
  LastUpdatedDate: number
  ModuleName: string
  ModuleCode: number
  ParentModuleOid: number
  IsActive: boolean
}

export interface RoleListResponse {
  Oid: number
  CreatedDate: number
  LastUpdatedDate: number
  RoleCode: number
  RoleName: string
  IsActive: boolean
}
