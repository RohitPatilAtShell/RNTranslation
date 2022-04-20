import * as Service from '../reduxUtils/LocalizeService';

export function getGlobalJsonService() {
  const url =
    'https://rohitpatilatshell.github.io/RNTranslation/lokalise/config/OpApp_GlobalConfig.json';
  return Service.request(url, 'GET', {});
}

export function loginLocalizationDataService(url) {
  return Service.request(url, 'GET', {});
}

export function getCountriesListService() {
  const url =
    'https://rohitpatilatshell.github.io/RNTranslation/lokalise/config/OpApp_CountryList.json';
  return Service.request(url, 'GET', {});
}
