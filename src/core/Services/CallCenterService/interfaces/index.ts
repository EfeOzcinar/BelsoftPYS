/* eslint-disable prettier/prettier */

export interface Contact {
    Id: number;
    Name: string;
    City: string;
    County: string;
    Municipality: string;
    Phone: string;
    Email: string;
  }
  
  export interface CreateContactRequest {
    Name: string;
    City: string;
    County: string;
    Municipality: string;
    Phone: string;
    Email: string;
  }
  
  export interface Case {
    Id: number;
    ContactId: number;
    ContactName: string;
    Municipality: string;
    Description: string;
    Status: 'open' | 'in_progress' | 'resolved';
    CreatedAt: string;
    ResolvedAt?: string;
  }
  
  export interface CreateCaseRequest {
    ContactId: number;
    Description: string;
  }
  
  export interface UpdateCaseStatusRequest {
    CaseId: number;
    Status: 'open' | 'in_progress' | 'resolved';
  }
  