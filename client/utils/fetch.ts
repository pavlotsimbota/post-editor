import axios, { AxiosRequestConfig } from 'axios';

export const fetch = (options: AxiosRequestConfig) => {
  return axios({
    baseURL: '/api',
    ...options,
  });
};
