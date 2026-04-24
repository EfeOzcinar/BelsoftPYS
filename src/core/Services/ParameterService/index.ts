/* eslint-disable semi */
/* eslint-disable prettier/prettier */
import blsCore from '../..';
import { CompanyStatisticsResponse, ModuleResponse, RoleListResponse } from './interfaces';

export default class ParameterService {
  endPoint: string;

  constructor() {
    this.endPoint = '/Parameter';
  }

  getProjectList = async (): Promise<ProjectResponse[]> =>
    (await blsCore.api.request('get', `${this.endPoint}/GetProjectList`,{})) as unknown as ProjectResponse[];

  getCompanyList = async (): Promise<CompanyResponse[]> =>
    (await blsCore.api.request('get', `${this.endPoint}/GetCompanyList`,{})) as unknown as CompanyResponse[];

  getModuleListByParentOid = async (parentModuleOid: number): Promise<ModuleListResponse[]> =>
    (await blsCore.api.request('post', `${this.endPoint}/GetModuleListByParentOid`,{parentModuleOid})) as unknown as ModuleListResponse[];

  getModuleList = async (): Promise<ParentModulePesponse[]> =>
    (await blsCore.api.request('get', `${this.endPoint}/GetModuleList`,{})) as unknown as ParentModulePesponse[];

  getGeneralParameterList = async (parameterTypeCode: string): Promise<GetGeneralParameterListResponse[]> =>
    (await blsCore.api.request('post', `${this.endPoint}/GetGeneralParameterList`,{parameterTypeCode})) as unknown as GetGeneralParameterListResponse[];

  // # Task List By Criteria
  getTaskAndErrorListByCriteria = async (queryData: TaskAndErrorListByCriteriaRequest): Promise<TaskErrorListByCriteriaResponse[]> =>
    (await blsCore.api.request('post', `${this.endPoint}/GetTaskAndErrorListByCriteria`, queryData)) as unknown as TaskErrorListByCriteriaResponse[]

  getUserTaskAndErrorListByCriteria = async (queryData: TaskAndErrorListByCriteriaRequest): Promise<TaskErrorListByCriteriaResponse[]> =>
    (await blsCore.api.request('post', `${this.endPoint}/GetUserTaskAndErrorListByCriteria`, queryData)) as unknown as TaskErrorListByCriteriaResponse[]

  getAllErrorsAndTasks = async (): Promise<TaskErrorListByCriteriaResponse[]> =>
    (await blsCore.api.request('get', `${this.endPoint}/GetAllErrorsAndTasks`, {})) as unknown as TaskErrorListByCriteriaResponse[]

  getAllFavoriteErrorsAndTasks = async (userOid: number): Promise<GetAllFavoriteErrorsAndTasksResponse[]> =>
    (await blsCore.api.request('post', `${this.endPoint}/GetAllFavoriteErrorsAndTasks`, { userOid })) as unknown as GetAllFavoriteErrorsAndTasksResponse[]

  getErrorsAndTasksByPersonnel = async (queryData: GetErrorsAndTasksByPersonnelRequest): Promise<TaskErrorListByCriteriaResponse[]> =>
    (await blsCore.api.request('post', `${this.endPoint}/GetErrorsAndTasksByPersonnel`, queryData)) as unknown as TaskErrorListByCriteriaResponse[]

  processTaskOrError = async (queryData: ProcessTaskOrErrorRequest): Promise<boolean> =>
    (await blsCore.api.request('post', `${this.endPoint}/ProcessTaskOrError`, queryData)) as unknown as boolean

  stopProcessTaskOrError = async (queryData: ProcessTaskOrErrorRequest): Promise<boolean> =>
    (await blsCore.api.request('post', `${this.endPoint}/StopProcessTaskOrError`, queryData)) as unknown as boolean

  checkTaskOrErrorInProcess = async (queryData: ProcessTaskOrErrorRequest): Promise<boolean> =>
    (await blsCore.api.request('post', `${this.endPoint}/CheckTaskOrErrorInProcess`, queryData)) as unknown as boolean

  saveWorkSchedule = async (queryData: WorkScheduleRequest): Promise<TaskErrorListByCriteriaResponse[]> =>
    (await blsCore.api.request('post', `${this.endPoint}/SaveWorkSchedule`, queryData)) as unknown as TaskErrorListByCriteriaResponse[]

  getAllModuleList = async (): Promise<ModuleResponse[]> =>
    (await blsCore.api.request('post', `${this.endPoint}/GetAllModuleList`, {})) as unknown as ModuleResponse[]

  getCompanyStatistics = async (StartDate: number, EndDate: number): Promise<CompanyStatisticsResponse[]> =>
    (await blsCore.api.request('post', `${this.endPoint}/GetCompanyStatistics`, { StartDate, EndDate })) as unknown as CompanyStatisticsResponse[]

  getRoleList = async (): Promise<RoleListResponse[]> =>
    (await blsCore.api.request('post', `${this.endPoint}/GetRoleList`, {})) as unknown as RoleListResponse[]
}

