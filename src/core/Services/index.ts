/* eslint-disable prettier/prettier */
import AuthService from './AuthService';
import ErrorService from './ErrorService';
import ParameterService from './ParameterService';
import TaskAndErrorService from './TaskAndErrorService';
import FileService from './FileService';
import TaskService from './TaskService';
import CallCenterService from './CallCenterService';

export default class Services {
  authService: AuthService;
  errorService: ErrorService;
  parameterService: ParameterService;
  taskAndErrorService: TaskAndErrorService;
  fileService: FileService;
  taskService: TaskService;
  callCenterService: CallCenterService;

  constructor() {
    this.authService = new AuthService();
    this.errorService = new ErrorService();
    this.parameterService = new ParameterService();
    this.taskAndErrorService = new TaskAndErrorService();
    this.fileService = new FileService();
    this.taskService = new TaskService();
    this.callCenterService = new CallCenterService();
  }
}