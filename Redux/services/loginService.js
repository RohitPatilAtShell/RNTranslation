import * as Service from '../reduxUtils/Service';

export function userLoginService(payload) {
  const url = 'baseurl/api/login';
  const header = {
    'Content-Type': 'application/json',
  };
  const body = payload;
  return Service.request(url, 'POST', header, body);
}
