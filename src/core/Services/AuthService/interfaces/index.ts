interface LoginResponse {
  id: string;
  FailedPasswordAttemptCount: number;
  InstitutionId?: string;
  CreatedDate: any;
  IsActive: boolean;
  IsUserLocked: boolean;
  UserName: string;
  Password: string;
  UserType: string;
  UserDetailId: string;
}

interface InstitutionProps {
  id: string;
  CreatedDate: string;
  LastUpdatedDate: string;
  InstitutionCode: string;
  InstitutionName: string;
  InstitutionFullName: string;
  RelatedPerson: string;
  
  EducationLevelCode: string;
  GsmNumber: string;
  Email: string;
  Address: string;
  ContractStartDate: string;
  ContractFinishDate: string;
  Logo: string;
  IsManagingInstitution: boolean;
  IsActive: boolean;
}

interface ContactProps {
  id: string;
  Address: string;
  Email1: string;
  Email2: string;
  Facebook: string;
  GsmNumber: string;
  Instagram: string;
  InstitutionId?: string;
  LastUpdatedDate: string;
  PhoneNumber: string;
  Twitter: string;
  Youtube: string;
}

export type {LoginResponse, InstitutionProps, ContactProps};
