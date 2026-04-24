/* eslint-disable prettier/prettier */
import blsCore from '../..';
import { AddFavoriteTaskRequest, CloseTaskRequest, CloseTaskResponse, GetFavoriteInfoByTaskOidRequest, SaveAssignTaskRequest, SaveAssignTaskResponse, SaveTaskRequest, TaskFavoriteResponse, TaskListResponse } from './interfaces';

export default class TaskService {
  endPoint: string;

  constructor() {
    this.endPoint = '/Task';
  }

  saveTask = async (saveData: SaveTaskRequest): Promise<any> =>
    (await blsCore.api.request('post', `${this.endPoint}/SaveTask`, saveData,)) as unknown as any;

  getTaskInfo = async (taskOid: number): Promise<any> =>
    (await blsCore.api.request('post', `${this.endPoint}/GetTaskInfo`, { TaskOid: taskOid })) as unknown as any;

  saveAssignTask = async (savedData: SaveAssignTaskRequest): Promise<SaveAssignTaskResponse[]> =>
    (await blsCore.api.request('post', `${this.endPoint}/SaveAssignTask`, savedData)) as unknown as SaveAssignTaskResponse[];

  closeTask = async (data: CloseTaskRequest): Promise<CloseTaskResponse[]> =>
    (await blsCore.api.request('post', `${this.endPoint}/CloseTask`, data)) as unknown as CloseTaskResponse[];

  addFavoriteTask = async (savedData: AddFavoriteTaskRequest): Promise<TaskFavoriteResponse> =>
    (await blsCore.api.request('post', `${this.endPoint}/AddFavoriteTask`, savedData)) as unknown as TaskFavoriteResponse;

  getFavoriteInfoByTaskOid = async (queryData: GetFavoriteInfoByTaskOidRequest): Promise<TaskFavoriteResponse> =>
    (await blsCore.api.request('post', `${this.endPoint}/GetFavoriteInfoByTaskOid`, queryData)) as unknown as any;

  getAssignedTaskListByUserOid = async (userOid: number, showClosedTask?: boolean): Promise<TaskListResponse[]> =>
    (await blsCore.api.request('post', `${this.endPoint}/GetAssignedTaskListByUserOid`, { userOid, showClosedTask })) as unknown as TaskListResponse[]

}
