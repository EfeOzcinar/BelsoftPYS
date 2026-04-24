/* eslint-disable prettier/prettier */
import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
type Method = 'get' | 'post' | 'put' | 'delete';


export default class Api {
  axios: AxiosInstance;

    constructor() {
      this.axios = axios.create({
        baseURL:  'https://bys.belsoft.com.tr:1005/Service',
        headers: {
          'Content-type': 'application/json',
        },
      });
    }

  setBaseUrl(newBaseUrl: string) {
    this.axios = axios.create({
      baseURL: newBaseUrl,
      headers: {
        'Content-type': 'application/json',
      },
    });
    this.axios.defaults.baseURL = newBaseUrl;
  }

  onSuccess(response: AxiosResponse): AxiosResponse {
    if (response.status === 200) {
      return response.data;
    } else {
      console.log(response.status);
      return response.data;
    }
  }

  onFailed(error: AxiosError<any, any>): Error {
    throw new Error(error?.message);
  }

  async request(
    method: Method = 'post',
    endPoint: string,
    data: any,
    config?: AxiosRequestConfig,
  ) {
    try {
      let response = null;
      switch (method) {
        case 'get':
          response = await this.axios.get(endPoint, { ...config, params: data });
          break;
        case 'post':
          response = await this.axios.post(endPoint, data, config);
          break;
        case 'put':
          response = await this.axios.put(endPoint, data, config);
          break;
        case 'delete':
          response = await this.axios.delete(endPoint, config);
          break;
        default:
          break;
      }
      if (response && response.status === 200) {
        return this.onSuccess(response);
      } else {
        throw new Error('Request failed');
      }
    } catch (error) {
      // console.error('Request exception:', error);
      throw error;
    }
  }
}
