export interface SaveTaskRequest {
  Oid?: number;
  TaskTitle: string;
  TaskExplanation: string;
  Priority: string;
  CompanyOid: number;
  ProjectOid: number;
  ModuleOid: number;
  TaskStatusCode?: number;
  CreatedUserOid: number;
  UpdatedDate: number;
  UpdateUserOid: number;
  DeletedDate: number;
  DeleteUserOid: number;
  ClosedDate: number;
  CloseUserOid: number;
  IsTaskClosed: boolean;
  EstimatedFinishDate: number;
  TaskDocumentList: [
    {
      DeletedDate_: number;
      TaskOid?: number;
      FileExplanation?: string;
      FileName: string;
      OriginalFilename: string;
      FileExtension: string;
      FileUrl: string;
      ProjectOid?: number;
      ModuleName?: string;
      CreatedUserOid?: number;
      DeletedUserOid?: number;
      IsActive: boolean;
    },
  ];
  TaskDetail: {
    Description: string;
    CreatedUserOid: number;
    SendUserOid: number;
    TaskStatusCode: number;
    InProgress: string;
    TaskOid: number;
  };
}

export interface SaveAssignTaskRequest {
  Description: string;
  CreatedUserOid: number;
  SendUserOid: number;
  TaskStatusCode: number;
  InProgress: string;
  TaskOid: number;
  Duration: number;
}

export interface SaveAssignTaskResponse {
  Oid: number;
  CreatedDate: number;
  LastUpdatedDate: number;
  Description: string;
  CreatedUserOid: number;
  SendUserOid: number;
  TaskStatusCode: number;
  InProgress: string;
  TaskOid: number;
  Duration: number;
}

export interface CloseTaskRequest {
  TaskOid: number;
  TaskStatusCode: number;
  CloseUserOid: number;
  Closedexplanation: string;
}

export interface CloseTaskResponse {
  Oid: number;
  CreatedDate: number;
  LastUpdatedDate: number;
  TaskTitle: string;
  TaskExplanation: string;
  Priority: string;
  CompanyOid: number;
  ProjectOid: number;
  ModuleOid: number;
  TaskStatusCode: number;
  CreatedUserOid: number;
  UpdatedDate: number;
  UpdateUserOid: number;
  DeletedDate: number;
  DeleteUserOid: number;
  ClosedDate: number;
  CloseUserOid: number;
  CompanyRequestOid: number;
  TaskNo: number;
  IsTaskClosed: boolean;
  TaskDocumentList: null;
  TaskDetailList: null;
  TaskNoteList: null;
  SendUserOid: number;
  SenderUserOid: number;
}

export interface AddFavoriteTaskRequest {
  TaskOid: number;
  UserOid: number;
  IsActive: boolean;
}
export interface TaskFavoriteResponse {
  Oid: number;
  CreatedDate: number;
  LastUpdatedDate: number;
  TaskOid: number;
  UserOid: number;
  IsActive: boolean;
}

export interface GetFavoriteInfoByTaskOidRequest {
  UserOid: number;
  TaskOid: number;
}

export interface GetAllFavoriteErrorsAndTasksResponse {
  Oid: number;
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
  Closedexplanation: null;
  No: number;
  Type: string;
  SendUserOid: number;
  SenderUserOid: number;
  IsActive: boolean;
}

export interface TaskListResponse {
  Oid: number
  CreatedDate: number
  LastUpdatedDate: number
  TaskTitle: string
  TaskExplanation: string
  Priority: string
  CompanyOid: number
  ProjectOid: number
  ModuleOid: number
  TaskStatusCode: number
  CreatedUserOid: number
  UpdatedDate: any
  UpdateUserOid: number
  DeletedDate: number
  DeleteUserOid: number
  ClosedDate: number
  CloseUserOid: number
  CompanyRequestOid: number
  TaskNo: number
  IsTaskClosed: boolean
  TaskDocumentList: any
  TaskDetailList: any
  TaskNoteList: any
  SendUserOid: number
  EstimatedFinishDate: number
  SenderUserOid: number
}
