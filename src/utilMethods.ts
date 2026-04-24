/* eslint-disable no-return-assign */
/* eslint-disable semi */
/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
import moment from 'moment';
import { Dimensions } from 'react-native';
import blsCore from './core';

const { width, height } = Dimensions.get('window');
const baseWidth = 320; // Standard width
const baseHeight = 568; // Standard height
const widthRatio = width / baseWidth;
const heightRatio = height / baseHeight;
const ratio = Math.min(widthRatio, heightRatio);

export const getObjectDataWithPath = (obj: any, path: string) => {
  if (
    obj === undefined ||
    obj === null ||
    typeof obj !== 'object' ||
    path === undefined ||
    path === null ||
    typeof path !== 'string'
  ) {
    return undefined;
  }
  const pathArray = path.split('.');
  if (pathArray.length === 0) {
    return undefined;
  }
  let data = obj;

  for (let i = 0; i < pathArray.length; i++) {
    if (data[pathArray[i]] === undefined || data[pathArray[i]] === null) {
      return undefined;
    }
    data = data[pathArray[i]];
  }

  return data;
};

export const convertToDate = (dateData: { seconds: number; nanoseconds: number }) => {
  const dateObject = new Date(dateData.seconds * 1000);

  return moment(dateObject).format('DD.MM.YYYY');
};

export function convertIntToDate(value: any): string {
  if (value) {
    if (moment(value, 'YYYYMMDD').isValid() || moment(value, 'YYYYMMDDHHMMSS').isValid())
      return moment(value, 'YYYYMMDD').format('DD.MM.YYYY')
  }
  return 'Bulunmadı'
}

export const convertTimeStampToTime = (dateData: { seconds: number; nanoseconds: number }) => {
  const date = new Date(dateData.seconds * 1000 + dateData.nanoseconds / 1e6);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${hours}:${minutes}:${seconds}`;
};

export const convertTimeStampToDate = (dateData: { seconds: number; nanoseconds: number }) => {
  if (dateData) {
    const dateObject = new Date(dateData.seconds * 1000);
    return dateObject;
  }
  return new Date();
};

export const convertLessonCodeToLessonName = (lessonCode: string, lessonList: any) => {
  let lessonName = '';
  if (lessonList) {
    const filterdValue = lessonList.find((x: any) => x.LessonCode === lessonCode);
    if (filterdValue) {
      lessonName = filterdValue.LessonName;
    }
  }

  return lessonName;
};

export const convertUnitCodeToUnitName = (unitCode: string, unitList: any) => {
  let unitName = '';
  if (unitList) {
    const filterdValue = unitList.find((x: any) => x.UnitCode === unitCode);
    if (filterdValue) {
      unitName = filterdValue.UnitName;
    }
  }

  return unitName;
};

export const convertTopicodeToName = (topicCode: string, topicList: any) => {
  let topicName = '';
  if (topicList) {
    const filterdValue = topicList.find((x: any) => x.TopicCode === topicCode);
    if (filterdValue) {
      topicName = filterdValue.TopicName;
    }
  }

  return topicName;
};

export const convertClassCodeToName = (classCode: string, classList: any) => {
  let className = '';
  if (classList) {
    const filterdValue = classList.find((x: any) => x.ClassCode === classCode);
    if (filterdValue) {
      className = filterdValue.ClassName;
    }
  }

  return className;
};

export const convertPublishingHouseListCodeToName = (publishingHouseCodeList: string[], publishingHouseList: any) => {
  let lessonName = '';
  if (publishingHouseList) {
    publishingHouseCodeList.forEach(item => {
      const filterdValue = publishingHouseList.find((x: any) => x.PublishingHouseCode === item);
      if (filterdValue) {
        lessonName += `${filterdValue.PublishingHouseName} , `;
      }
    });
  }
  return lessonName;
};

export const convertClassCodeListToName = (classCodeList: string[], classList: any) => {
  let className = '';
  if (classList) {
    classCodeList.forEach(item => {
      const filterdValue = classList.find((x: any) => x.ClassCode === item);
      if (filterdValue) {
        className += `${filterdValue.ClassName ?? ''} , `;
      }
    });
  }
  return className;
};



export const generateRandomId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';

  let randomId = '';
  /* eslint-disable no-plusplus */
  for (let i = 0; i < 3; i++) {
    randomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  for (let i = 0; i < 4; i++) {
    randomId += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return randomId;
}

export const convertStudentIdToStudentName = (stdId: string, studentList: any) => {
  let stdName = '';
  if (studentList) {
    const filterdValue = studentList.find((x: any) => x.id === stdId);
    if (filterdValue) {
      stdName = `${filterdValue.Name} ${filterdValue.Surname}`;
    }
  }
  return stdName;
};

export const convertTeacherIdToTeacherName = (teacherId: string, userList: any) => {
  let teacherName = '';
  if (userList) {
    const filterdValue = userList.find((x: any) => x.id === teacherId);
    if (filterdValue) {
      teacherName = `${filterdValue.Name} ${filterdValue.Surname}`;
    }
  }
  return teacherName;
};

export const convertStudentLevelCodeToName = (stdLevelCode: string, stdLevelList: any) => {
  let stdLevelName = '';
  if (stdLevelList) {
    const filterdValue = stdLevelList.find((x: any) => x.ParameterCode === stdLevelCode);
    if (filterdValue) {
      stdLevelName = filterdValue.ParameterName;
    }
  }
  return stdLevelName;
};


export const getResponsiveSize = (baseFontSize: number) => Math.ceil(baseFontSize * ratio);


export const parseDateString = (dateString: string, lastTimeOfDay: boolean = false): Date => {
  const [day, month, year] = dateString.split('.').map(Number);
  if (lastTimeOfDay) {
    const [hours, minutes] = [23, 59];
    return new Date(year, month - 1, day, hours, minutes);
  }
  return new Date(year, month - 1, day); // Month is 0-based in JavaScript Date
};

export const parseDateTimeToString = (dateTime: any): Date => {
  console.log('🚀 ~ parseDateTimeToString ~ dateTime:', dateTime)
  if (dateTime && moment(dateTime).isValid()) {
    const dateString = moment(dateTime).format('DD.MM.YYYY');
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day); // Month is 0-based in JavaScript Date
  }

  return new Date();

};


export const convertToDateTime = (value: string) => {
  if (moment(value, 'DD.MM.YYYY').isValid() || moment(value, 'DD.MM.YYYY').isValid()) {
    return moment(value, 'DD.MM.YYYY').toDate();
  }
  if (moment(value, 'DD.MM.YYYY').isValid()) {
    return moment(value, 'DD.MM.YYYY').toDate();
  }
  return '';
};


export const convertToCurrency = (amount: any) => {
  let slcAmount = amount;
  if (slcAmount !== null && slcAmount) {
    slcAmount = slcAmount.toString().replace(',', '.');
    if (parseFloat(slcAmount) < 0) {
      slcAmount = slcAmount.toString().replace('-', '');
      return `- ${new Intl.NumberFormat('tr', { style: 'currency', currency: 'TRY' })
        .format(amount)
        .slice(1)} ${new Intl.NumberFormat('tr', { style: 'currency', currency: 'TRY' }).format(amount).slice(0, 1)}`;
    }
    return `${new Intl.NumberFormat('tr', { style: 'currency', currency: 'TRY' })
      .format(amount)
      .slice(1)} ${new Intl.NumberFormat('tr', { style: 'currency', currency: 'TRY' }).format(amount).slice(0, 1)}`;
  }
  return `${new Intl.NumberFormat('tr', { style: 'currency', currency: 'TRY' })
    .format(0)
    .slice(1)} ${new Intl.NumberFormat('tr', { style: 'currency', currency: 'TRY' }).format(0).slice(0, 1)}`;
};

export const convertDateToNumber = (dateString: string): number => {
  const [day, month, year] = dateString.split('.').map(Number);
  return year * 10000 + month * 100 + day;
};


export function convertDateNumberToDateTime(dateNumber: number) {
  // Sayıyı stringe çevir
  const inputStr = dateNumber.toString();

  // Tarihi al ve parçala
  const year = inputStr.substring(0, 4);
  const month = inputStr.substring(4, 6);
  const day = inputStr.substring(6, 8);
  const hours = inputStr.substring(8, 10);
  const minutes = inputStr.substring(10, 12);

  // Yeni formatta döndür
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

export function observeSelectedFile(documentInfo: any, moduleName: any) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!documentInfo.FileExtension) { documentInfo.FileExtension = documentInfo.Extension }

      if (['.jpg', 'jpg', '.png', 'png', '.PNG', 'PNG', '.JPG', 'JPG', '.jpeg', 'jpeg'].includes(documentInfo.FileExtension)) {
        documentInfo.FileExtension = documentInfo.FileExtension.toLowerCase() === '.jpg' ? '.jpg' : '.png';

        if (documentInfo.Base64String !== null && documentInfo.Base64String !== undefined) {
          resolve({ docType: documentInfo.FileExtension, docUrl: documentInfo.Base64String })
        }
        else {
          const fileRequest: any = {}
          fileRequest.ModuleName = moduleName
          fileRequest.ProcessDate = documentInfo.CreatedDate ?? moment().format()
          fileRequest.FileName = documentInfo.FileDisplayname
          fileRequest.FileExtension = documentInfo.FileExtension
          fileRequest.Oid = documentInfo.Oid ?? 0
          const serviceDocument: any = await blsCore.services.fileService.getFileByOid(documentInfo.Oid)
          resolve({ docKind: 'image', docType: documentInfo.FileExtension, docUrl: serviceDocument.Base64String, docOid: documentInfo.Oid ?? 0 })
        }
      }
      if (['.pdf', 'pdf'].includes(documentInfo.FileExtension)) {
        documentInfo.FileExtension = documentInfo.FileExtension.toLowerCase() === '.pdf' ? '.pdf' : '.pdf';

        if (documentInfo.Base64String !== null && documentInfo.Base64String !== undefined) {
          resolve({ docType: documentInfo.FileExtension, docUrl: documentInfo.Base64String })
        }
        else {
          const fileRequest: any = {}
          fileRequest.ModuleName = moduleName
          fileRequest.ProcessDate = documentInfo.CreatedDate ?? moment().format()
          fileRequest.FileName = documentInfo.FileDisplayname
          fileRequest.FileExtension = documentInfo.FileExtension
          fileRequest.Oid = documentInfo.Oid ?? 0
          const serviceDocument: any = await blsCore.services.fileService.getFileByOid(documentInfo.Oid)
          resolve({ docKind: 'pdf', docType: documentInfo.FileExtension, docUrl: serviceDocument.Base64String, docOid: documentInfo.Oid ?? 0 })
        }
      }
    }
    catch (e) {
      console.log('🚀 ~ returnnewPromise ~ e:', e)
      reject(e)
    }
  })
}

export function convertTimeToMinutes(value: string | any) {
  if (value && value.length > 0) {
    const timeArray = value.split(':')
    const hours = timeArray[0]
    const minutes = timeArray[1]

    return Number(hours) * 60 + Number(minutes)
  }

  else {
    return 0
  }
}

export function getCurrentTime() {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  return `${hours}${minutes}${seconds}`
}

export function convertTimeToInt(value: string) {
  if (value && value.length > 0) {
    const timeInt = Number(value.replace(':', ''))
    return timeInt
  }
  else {
    return 0
  }
}

export function convertDateToInt(value: string, isStartDate: boolean = false, isEndDate: boolean = false) {
  if (moment(value, 'DD.MM.YYYY').isValid()) {
    let datePart = moment(value, 'DD.MM.YYYY').format('YYYYMMDD')

    if (isStartDate) {
      datePart += '000000'
    }
    if (isEndDate) {
      datePart += '235959'
    }
    // const timePart = moment().format('HHmmss')
    return Number(datePart) // Number.parseInt(${datePart}${timePart}) 20240710000000
  }
  else {
    return 0
  }
}

export function convertUserOidToName(userOid: number, userList: any) {
  let userName = 'Bulunamadı'
  if (userList && userList.length > 0) {
    const userInfo = userList.find((item: any) => item.Oid === userOid)
    if (userInfo) { return userName = `${userInfo.Name} ${userInfo.SurName}` }

    else { return userName }
  }
  else {
    return 'Bulunamadı'
  }
}

export function convertRoleCodeToName(roleCode: number, roleList: any) {
  let roleName = ''
  if (roleList) {
    const titleInfo = roleList.find((item: any) => item.RoleCode === roleCode)
    if (titleInfo) { return roleName = titleInfo.RoleName }

    else { return roleName }
  }
  else {
    return ''
  }
}

export function filterUniqueOid(list: any[]) {
  if (list && list.length > 0) {
    const seenOids = new Set()
    return list.filter((item) => {
      if (seenOids.has(item.Oid)) {
        return false
      }
      else {
        seenOids.add(item.Oid)
        return true
      }
    })
  }
  else {
    return []
  }
}

export function convertTaskStatusCodeToName(taskStatusCode: number, taskStatusList: any) {
  let taskStatusName = ''
  if (taskStatusList) {
    const taskStatusInfo = taskStatusList.find((item: any) => item.ParameterCode === taskStatusCode)
    if (taskStatusInfo)
      return taskStatusName = taskStatusInfo.ParameterName

    else
      return taskStatusName
  }
  else {
    return ''
  }
}