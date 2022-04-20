/**
 * @flow
 */
import axios, {AxiosPromise} from 'axios';
import Config from 'react-native-config';
import {store} from './../store/configureStore';
import qs from 'qs';

type params = {
  url: string,
  method: string,
  headers?: Object | Array<Object>,
  body?: Object | Array<Object>,
  formData?: Object | Array<Object>,
};

const request = ({
  url,
  method,
  headers,
  body,
  formData,
}: params): AxiosPromise => {
  const instance = axios.create({
    baseURL: Config.APIGEE_HOST,
  });
  instance.interceptors.request.use(
    config => {
      config.params = {
        apikey: Config.API_KEY,
      };
      const state = store.getState();

      // if (state.loginWithUserNamePassword.payload) {
      //   if (state.loginWithUserNamePassword.payload.access_token) {
      //     const interCeptorHeaders = {
      //       Authorization: `Bearer ${
      //         state.loginWithUserNamePassword.payload.access_token
      //       }`,
      //     };
      //     Object.assign(config.headers.common, interCeptorHeaders);
      //   }
      // }

      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  return instance({
    method,
    url,
    headers,
    data: body
      ? headers['Content-Type'] === 'application/x-www-form-urlencoded'
        ? qs.stringify(body)
        : JSON.stringify(body)
      : formData,
  });
};

export {request};
