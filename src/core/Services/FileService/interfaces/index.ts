export interface UploadFileRequest {
  UserName: string;
  Request: {
    Oid: number;
    FileName: string;
    FileExtension: string;
    Length: number;
    FileByteStream: {
      Position: number;
      ReadTimeout: number;
      WriteTimeout: number;
    };
    TemporaryFileName: string;
    Base64String: string;
    ModuleName: string;
    ProcessDate: string;
    IsDocumentExist: boolean;
    FileUrl: string;
  };
}

export interface FileByPathResponse {
  Oid: number;
  FileName: string;
  FileExtension: string;
  Length: number;
  FileByteStream: any;
  TemporaryFileName: any;
  Base64String: string;
  ModuleName: string;
  ProcessDate: string;
  IsDocumentExist: boolean;
  FileUrl: any;
}
