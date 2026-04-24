/* eslint-disable @typescript-eslint/no-unused-vars */
interface TaskErrorListByCriteriaResponse {
  Oid: number | any;
  CreatedDate: number;
  LastUpdatedDate: number;
  Title: string;
  Explanation: string;
  Priority: string;
  CompanyOid: number;
  ProjectOid: number;
  ModuleOid: number;
  StatusCode: number;
  CreatedUserOid: number;
  UpdatedDate: number;
  UpdateUserOid: number;
  DeletedDate: number;
  DeleteUserOid: number;
  ClosedDate: number;
  CloseUserOid: number;
  CompanyRequestOid: number;
  No: number;
  IsTaskClosed: boolean;
  SendUserOid: number;
  SenderUserOid: number;
  Type: string;
  Duration: any;
  StartDate: any;
  EndDate: any;
  RemainingDuration: any;
  DetailOid: number;
}

interface TaskAndErrorListByCriteriaRequest {
  UserOid?: number;
  StartDate?: number;
  EndDate?: number;
  Priority?: string;
  CompanyOid?: number;
  ProjectOid?: number;
  ModuleOidList?: number[];
  StatusCode?: number;
  CreatedUserOid?: number;
  ClosedUserOid?: number;
  IsTaksClosed?: boolean;
  ShowClosedTask?: boolean;
  TaskOrErrorNumber?: number;
  IsActive?: boolean;
}
interface WorkScheduleRequest {
  UserOid?: number;
  StartDate?: number;
  EndDate?: number;
  Priority?: string;
  CompanyOid?: number;
  ProjectOid?: number;
  ModuleOidList?: number[];
  StatusCode?: number;
  CreatedUserOid?: number;
  ClosedUserOid?: number;
  IsTaksClosed?: boolean;
  ShowClosedTask?: boolean;
  TaskOrErrorNumber?: number;
  TaskOrErrorType: string;
}
interface UserIstatisticInfo {
  UserOid: number;
  CompanyOid: number;
  TotalTaskNumber: number;
  TotalErrorNumber: number;
  TotalActiveTaskNumber: number;
  TotalActiveErrorNumber: number;
  TotalClosedTaskNumber: number;
  TotalClosedErrorNumber: number;
}
interface CheckTaskOrErrorInProcess {
  UserOid: number;
  CompanyOid: number;
  TaskOrErrorOid: number;
  TaskOrErrorDetailOid: number;
}

interface ProcessTaskOrErrorRequest {
  UserOid: number;
  TaskOrErrorOid: number;
  TaskOrErrorDetailOid: number;
  Type?: string;
}

interface WorkScheduleByUserOidRequest {
  TaskOrErrorNumber?: number,
  UserOid?: number,
  CompanyOid?: number,
}
