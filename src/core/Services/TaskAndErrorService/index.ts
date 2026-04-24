/* eslint-disable prettier/prettier */
import blsCore from '../..';

export default class TaskAndErrorService {
  endPoint: string;

  constructor() {
    this.endPoint = '/TaskAndError';
  }

  getUserTaskAndErrorListByCriteria = async (queryData: TaskAndErrorListByCriteriaRequest): Promise<TaskErrorListByCriteriaResponse[]> =>
    (await blsCore.api.request('post', `${this.endPoint}/GetUserTaskAndErrorListByCriteria`, queryData)) as unknown as TaskErrorListByCriteriaResponse[];

  getAllErrorsAndTasks = async (): Promise<TaskErrorListByCriteriaResponse[]> =>
    (await blsCore.api.request('get', `${this.endPoint}/GetAllErrorsAndTasks`, {})) as unknown as TaskErrorListByCriteriaResponse[];

  getCompanyTaskAndErrorListByCriteria = async (queryData: TaskAndErrorListByCriteriaRequest): Promise<TaskErrorListByCriteriaResponse[]> =>
    (await blsCore.api.request('post', `${this.endPoint}/GetCompanyTaskAndErrorListByCriteria`, queryData)) as unknown as TaskErrorListByCriteriaResponse[];

  saveWorkSchedule = async (queryData: WorkScheduleRequest): Promise<TaskErrorListByCriteriaResponse[]> =>
    (await blsCore.api.request('post', `${this.endPoint}/SaveWorkSchedule`, queryData)) as unknown as TaskErrorListByCriteriaResponse[];

  getUserIstatisticInfo = async (queryData: TaskAndErrorListByCriteriaRequest): Promise<UserIstatisticInfo> =>
    (await blsCore.api.request('post', `${this.endPoint}/GetUserIstatisticInfo`, queryData)) as unknown as UserIstatisticInfo;


  processTaskOrError = async (queryData: ProcessTaskOrErrorRequest): Promise<boolean> =>
    (await blsCore.api.request('post', `${this.endPoint}/ProcessTaskOrError`, queryData)) as unknown as boolean;

  stopProcessTaskOrError = async (queryData: ProcessTaskOrErrorRequest): Promise<boolean> =>
    (await blsCore.api.request('post', `${this.endPoint}/StopProcessTaskOrError`, queryData)) as unknown as boolean;

  checkTaskOrErrorInProcess = async (queryData: ProcessTaskOrErrorRequest): Promise<boolean> =>
    (await blsCore.api.request('post', `${this.endPoint}/CheckTaskOrErrorInProcess`, queryData)) as unknown as boolean;

  getTaskAndErrorListInProcess = async (): Promise<TaskErrorListByCriteriaResponse[]> =>
    (await blsCore.api.request('get', `${this.endPoint}/GetTaskAndErrorListInProcess`, {})) as unknown as TaskErrorListByCriteriaResponse[];

  getTaskAndErrorListByDate = async (queryData: TaskAndErrorListByCriteriaRequest): Promise<TaskErrorListByCriteriaResponse[]> =>
    (await blsCore.api.request('post', `${this.endPoint}/GetTaskAndErrorListByDate`, queryData)) as unknown as TaskErrorListByCriteriaResponse[];

  getTaskAndErrorListByCriteria = async (queryData: TaskAndErrorListByCriteriaRequest): Promise<TaskErrorListByCriteriaResponse[]> =>
    (await blsCore.api.request('post', `${this.endPoint}/GetTaskAndErrorListByCriteria`, queryData)) as unknown as TaskErrorListByCriteriaResponse[];

  getWorkScheduleByUserOid = async (queryData: TaskAndErrorListByCriteriaRequest): Promise<TaskErrorListByCriteriaResponse[]> =>
    (await blsCore.api.request('post', `${this.endPoint}/GetWorkScheduleByUserOid`, queryData)) as unknown as TaskErrorListByCriteriaResponse[];

  getUserTaskAndErrorDetailListWithDuration = async (queryData: TaskAndErrorListByCriteriaRequest): Promise<TaskErrorListByCriteriaResponse[]> =>
    (await blsCore.api.request('post', `${this.endPoint}/GetUserTaskAndErrorDetailListWithDuration`, queryData)) as unknown as TaskErrorListByCriteriaResponse[];


  getActiveErrorsAndTasksListByCreatedUser = async (queryData: TaskAndErrorListByCriteriaRequest): Promise<TaskErrorListByCriteriaResponse[]> =>
    (await blsCore.api.request('post', `${this.endPoint}/GetActiveErrorsAndTasksListByCreatedUser`, queryData)) as unknown as TaskErrorListByCriteriaResponse[]


}
