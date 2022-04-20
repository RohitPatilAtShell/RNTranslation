import axios from 'axios';

export function request(URL, method, headers, body, formData) {
  return axios({
    method,
    url: URL,
    headers,
    data: body ? JSON.stringify(body) : formData,
  });
}
