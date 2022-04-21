import * as ActionTypes from '../actionConstants/localizationActionTypes';
import ActionDispatcher from '../reduxUtils/ActionDispatcher';
import * as service from '../services/localizationService';
const axios = require('axios');

/* Global timestamp api action */
export const getGlobalTimestamp = () => {
  return ActionDispatcher(
    service.getGlobalTimestampService,
    ActionTypes.GLOBAL_TIMESTAMP_API_SUCCESS,
    ActionTypes.GLOBAL_TIMESTAMP_API_FAILURE,
    ActionTypes.GLOBAL_TIMESTAMP_API_PROGRESS,
  );
};
export const clearGlobalTimestampApiData = () => ({
  type: ActionTypes.CLEAR_GLOBAL_TIMESTAMP_API_DATA,
});

export const setTimeStamp = timestamp => ({
  type: ActionTypes.SET_TIMESTAMP,
  timestamp,
});

export const clearAllTranslationData = () => ({
  type: ActionTypes.CLEAR_ALL_TRANSLATION_DATA,
});

/* Global json api action */
export const getGlobalJson = () => {
  return ActionDispatcher(
    service.getGlobalJsonService,
    ActionTypes.GLOBAL_CONFIG_API_SUCCESS,
    ActionTypes.GLOBAL_CONFIG_API_FAILURE,
    ActionTypes.GLOBAL_CONFIG_API_PROGRESS,
  );
};
export const clearGlobalConfigApiData = () => ({
  type: ActionTypes.CLEAR_GLOBAL_CONFIG_API_DATA,
});

/* login json api action */
export const getLoginLocalizationData = url => {
  return ActionDispatcher(
    service.loginLocalizationDataService.bind(null, url),
    ActionTypes.LOGIN_CONFIG_API_SUCCESS,
    ActionTypes.LOGIN_CONFIG_API_FAILURE,
    ActionTypes.LOGIN_CONFIG_API_PROGRESS,
  );
};
export const clearLoginConfigApiData = () => ({
  type: ActionTypes.CLEAR_LOGIN_CONFIG_API_DATA,
});

/* country list api action */
export const getCountriesListData = () => {
  return ActionDispatcher(
    service.getCountriesListService,
    ActionTypes.COUNTRIES_LIST_API_SUCCESS,
    ActionTypes.COUNTRIES_LIST_API_FAILURE,
    ActionTypes.COUNTRIES_LIST_API_PROGRESS,
  );
};

export const clearCountriesListApiData = () => ({
  type: ActionTypes.CLEAR_COUNTRIES_LIST_API_DATA,
});

/* For setting the selected country data */
export const setSelectedCountry = selectedCountryData => ({
  type: ActionTypes.SET_SELECTED_COUNTRY,
  selectedCountryData,
});

/* For setting the selected language data */
export const setSelectedCountryLanguage = selectedLang => ({
  type: ActionTypes.SET_SELECTED_COUNTRY_LANGUAGE,
  selectedLang,
});

/* Translation api actions */
const fetchTranslationSuccess = data => ({
  type: ActionTypes.FETCH_TRANSLATION_SUCCESS,
  payload: data,
});

const fetchTranslationFailure = errorObj => ({
  type: ActionTypes.FETCH_TRANSLATION_FAILURE,
  error: errorObj.status ? errorObj.status : '',
  data: errorObj.data ? errorObj.data : {},
  message: errorObj.message ? errorObj.message : '',
});

const fetchTranslationProgress = () => ({
  type: ActionTypes.FETCH_TRANSLATION_PROGRESS,
});

export const clearTranslationApiData = () => ({
  type: ActionTypes.CLEAR_TRANSLATION_API_DATA,
});

export const fetchTranslations = (langObj, selectedLang) => {
  return async dispatch => {
    try {
      dispatch(fetchTranslationProgress());
      // check the network connection: if connected then call the api otherwise disptach the failure action with no internet message
      // You can check from the ActionDispatcher file in RSMA app
      let helpResponseArray = [];
      langObj.Help.map(async item => {
        try {
          const helpResponse = await axios.get(item.src);
          return helpResponseArray.push(helpResponse.data);
        } catch (error) {
          console.log('error', error);
          return;
        }
      });
      const responses = await Promise.all([
        axios.get(langObj.translation.src),
        axios.get(langObj.CF.src),
        axios.get(langObj.GSD.src),
      ]);
      let translationObject = {};

      if (responses && responses.length) {
        const translationData = responses[0].data;
        const feedbackData = responses[1].data;
        const gsdData = responses[2].data;
        translationObject = {
          [selectedLang.countryLanguage]: {
            translationData: {...translationData},
            feedbackData: {...feedbackData},
            gsdData: {...gsdData},
            helpData: helpResponseArray,
          },
        };
      }

      if (responses.length && helpResponseArray) {
        dispatch(fetchTranslationSuccess(translationObject));
      } else {
        const errorObj = {
          status: '400',
          message: 'Unable to download translations. Please try again later',
        };
        dispatch(fetchTranslationFailure(errorObj));
      }
    } catch (error) {
      console.log('error', error);
      const errorObj = {
        status: '400',
        message: 'Unable to download translations. Please try again later',
      };
      dispatch(fetchTranslationFailure(errorObj));
    }
  };
};

export const setAppTranslationData = translations => ({
  type: ActionTypes.SET_APP_TRANSLATION_DATA,
  payload: translations,
});

export const setLoginTranslationData = translations => ({
  type: ActionTypes.SET_LOGIN_TRANSLATION_DATA,
  payload: translations,
});
