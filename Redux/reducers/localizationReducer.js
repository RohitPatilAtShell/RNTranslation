import * as ActionTypes from '../actionConstants/localizationActionTypes';

const DEFAULT_LANG_COUNTRY_CODE = 'UK';

const GLOBAL_JSON_DATA = {
  isSuccess: false,
  isError: false,
  isLoading: false,
  globalPayload: undefined,
  globalCountries: [],
  error: '',
  message: '',
  errorData: undefined,
  loginDataUrl: '',
  defaultLangData: undefined,
};
const COUNTRIES_JSON_DATA = {
  isSuccess: false,
  isError: false,
  isLoading: false,
  countriesListPayload: [],
  error: '',
  message: '',
  errorData: undefined,
};

const LOGIN_JSON_DATA = {
  isSuccess: false,
  isError: false,
  isLoading: false,
  loginJsonPayload: undefined,
  error: '',
  message: '',
  errorData: undefined,
};

const TRANSLATION_DATA = {
  isSuccess: false,
  isError: false,
  isLoading: false,
  translationPayload: [],
  error: '',
  message: '',
  errorData: undefined,
};

const INITIAL_STATE = {
  globalData: {...GLOBAL_JSON_DATA},
  countriesListData: {...COUNTRIES_JSON_DATA},
  loginLocaliseData: {...LOGIN_JSON_DATA},
  translationData: {...TRANSLATION_DATA},
  selectedCountryData: undefined,
  selectedLangData: {},
  loginTranslationData: undefined,
  appTranslationData: undefined,
};

const getFormattedCountriesData = countryList => {
  let updatedCountryList = [];
  countryList.forEach(country => {
    country.Languages.forEach(lang => {
      let updatedCountryObj = {};
      updatedCountryObj.countryCode = country.code;
      updatedCountryObj.countryName = country.name;
      updatedCountryObj.langCode = lang.code;
      updatedCountryObj.langName = lang.name;
      updatedCountryObj.iOS = lang.iOS;
      updatedCountryObj.android = lang.android;
      updatedCountryObj.countryLanguage = `${country.name} ${lang.code}`;
      updatedCountryObj.countryLangKey = `${country.name}_${lang.code}`;
      updatedCountryList.push(updatedCountryObj);
    });
  });
  return updatedCountryList;
};

export default (state = INITIAL_STATE, action = {}) => {
  switch (action.type) {
    /* reducer for countries list */
    case ActionTypes.COUNTRIES_LIST_API_PROGRESS:
      return {
        ...state,
        countriesListData: {
          ...state.countriesListData,
          isLoading: true,
        },
      };
    case ActionTypes.COUNTRIES_LIST_API_SUCCESS:
      return {
        ...state,
        countriesListData: {
          ...state.countriesListData,
          isLoading: false,
          isSuccess: true,
          isError: false,
          countriesListPayload: action.payload.countryList,
        },
      };
    case ActionTypes.COUNTRIES_LIST_API_FAILURE:
      return {
        ...state,
        countriesListData: {
          ...state.countriesListData,
          isLoading: false,
          isSuccess: false,
          isError: true,
          error: action.error,
          message: action.message,
          errorData: action.data,
        },
      };
    case ActionTypes.CLEAR_COUNTRIES_LIST_API_DATA:
      return {
        ...state,
        countriesListData: {
          ...state.countriesListData,
          isLoading: false,
          isSuccess: false,
          isError: false,
        },
      };

    /* Reducer for storing data for the country selected */
    case ActionTypes.SET_SELECTED_COUNTRY:
      return {
        ...state,
        selectedCountryData: action.selectedCountryData,
      };

    /* Reducer for global json data */
    case ActionTypes.GLOBAL_CONFIG_API_PROGRESS:
      return {
        ...state,
        globalData: {
          ...state.globalData,
          isLoading: true,
        },
      };

    case ActionTypes.GLOBAL_CONFIG_API_SUCCESS:
      return {
        ...state,
        globalData: {
          ...state.globalData,
          isLoading: false,
          isSuccess: true,
          isError: false,
          globalPayload: action.payload,
          globalCountries: getFormattedCountriesData(action.payload.countries),
          loginDataUrl: action.payload.Login,
          defaultLangData: action.payload.countries.find(
            country => country.code === DEFAULT_LANG_COUNTRY_CODE,
          ),
        },
      };

    case ActionTypes.GLOBAL_CONFIG_API_FAILURE:
      return {
        ...state,
        globalData: {
          ...state.globalData,
          isLoading: false,
          isSuccess: false,
          isError: true,
          error: action.error,
          message: action.message,
          errorData: action.data,
        },
      };
    case ActionTypes.CLEAR_GLOBAL_CONFIG_API_DATA:
      return {
        ...state,
        globalData: {
          ...state.globalData,
          isLoading: false,
          isSuccess: false,
          isError: false,
        },
      };

    /* Reducer for storing data for the selected language */
    case ActionTypes.SET_SELECTED_COUNTRY_LANGUAGE:
      return {
        ...state,
        selectedLangData: action.selectedLang,
      };

    /* Reducer for login translation data */
    case ActionTypes.LOGIN_CONFIG_API_PROGRESS:
      return {
        ...state,
        loginLocaliseData: {
          ...state.loginLocaliseData,
          isLoading: true,
        },
      };

    case ActionTypes.LOGIN_CONFIG_API_SUCCESS:
      return {
        ...state,
        loginLocaliseData: {
          ...state.loginLocaliseData,
          isLoading: false,
          isSuccess: true,
          isError: false,
          loginJsonPayload: action.payload,
        },
      };

    case ActionTypes.LOGIN_CONFIG_API_FAILURE:
      return {
        ...state,
        loginLocaliseData: {
          ...state.loginLocaliseData,
          isLoading: false,
          isSuccess: false,
          isError: true,
          error: action.error,
          message: action.message,
          errorData: action.data,
        },
      };
    case ActionTypes.CLEAR_LOGIN_CONFIG_API_DATA:
      return {
        ...state,
        loginLocaliseData: {
          ...state.loginLocaliseData,
          isLoading: false,
          isSuccess: false,
          isError: false,
        },
      };

    /* reducer for translated data for selected country */
    case ActionTypes.FETCH_TRANSLATION_PROGRESS:
      return {
        ...state,
        translationData: {
          ...state.translationData,
          isLoading: true,
        },
      };
    case ActionTypes.FETCH_TRANSLATION_SUCCESS:
      return {
        ...state,
        translationData: {
          ...state.translationData,
          isLoading: false,
          isSuccess: true,
          isError: false,
          translationPayload: [
            ...state.translationData.translationPayload,
            action.payload,
          ],
        },
      };
    case ActionTypes.FETCH_TRANSLATION_FAILURE:
      return {
        ...state,
        translationData: {
          ...state.translationData,
          isLoading: false,
          isSuccess: false,
          isError: true,
          error: action.error,
          message: action.message,
          errorData: action.data,
        },
      };
    case ActionTypes.CLEAR_TRANSLATION_API_DATA:
      return {
        ...state,
        translationData: {
          ...state.translationData,
          isLoading: false,
          isSuccess: false,
          isError: false,
        },
      };

    /* reducer for storing app translation for selected language */
    case ActionTypes.SET_APP_TRANSLATION_DATA:
      return {
        ...state,
        appTranslationData: action.payload,
      };

    /* reducer for storing login translation for selected language */
    case ActionTypes.SET_LOGIN_TRANSLATION_DATA:
      return {
        ...state,
        loginTranslationData: action.payload,
      };
    default:
      return state;
  }
};
