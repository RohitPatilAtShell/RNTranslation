import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
  Text,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
// import {useIsFocused} from '@react-navigation/native';
import {
  getGlobalJson,
  getLoginLocalizationData,
  getCountriesListData,
  fetchTranslations,
  setSelectedCountry,
  clearCountriesListApiData,
  clearGlobalConfigApiData,
  clearLoginConfigApiData,
  setSelectedCountryLanguage,
  clearTranslationApiData,
  setAppTranslationData,
  setLoginTranslationData,
} from '../Redux/actions/localizationActions';
import LocalizedStrings from 'react-native-localization';

const DEFAULT_LANG_CODE = 'EN';
export const Main = () => {
  const dispatch = useDispatch();
  // const isFocused = useIsFocused();

  const localizationData = useSelector(state => state.localizationReducer);
  const {
    globalData,
    countriesListData,
    countriesListData: {countriesListPayload},
    loginLocaliseData,
    translationData,
    translationData: {translationPayload},
    selectedLangData,
  } = localizationData;

  /**
   *  Check if the files are already downloaded, if so then directly navigate to Login screen
   *  otherwise call globalJson and countries list api
   */
  useEffect(() => {
    if (
      globalData.globalPayload &&
      globalData.globalPayload.countries &&
      globalData.globalPayload.countries.length &&
      countriesListPayload &&
      countriesListPayload.length &&
      loginLocaliseData &&
      loginLocaliseData.loginJsonPayload &&
      translationPayload &&
      translationPayload.length
    ) {
      console.log('data already exist');
    } else {
      dispatch(getGlobalJson());
      dispatch(getCountriesListData());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   *  If globalJson api success: then fetch the login json data as well as default country translation data
   *  By default UK is the default country and EN is default language
   */
  useEffect(() => {
    if (globalData.isSuccess) {
      !loginLocaliseData.loginJsonPayload &&
        globalData.loginDataUrl &&
        dispatch(getLoginLocalizationData(globalData.loginDataUrl));

      /* To get the default language (UK english) data */
      const defaultLang =
        globalData.defaultLangData &&
        globalData.defaultLangData.Languages &&
        globalData.defaultLangData.Languages.length &&
        globalData.defaultLangData.Languages.find(
          lang => lang.code === DEFAULT_LANG_CODE,
        );
      /* Get the default language data and store in reducer */
      const selectedLang =
        globalData.globalCountries &&
        globalData.globalCountries.length &&
        globalData.globalCountries.find(
          country =>
            country.countryCode === 'UK' &&
            country.langCode === DEFAULT_LANG_CODE,
        );
      dispatch(setSelectedCountryLanguage(selectedLang));

      let defaultLangObj =
        Platform.OS === 'android' ? defaultLang.android : defaultLang.iOS;
      dispatch(fetchTranslations(defaultLangObj, selectedLang));
      dispatch(clearGlobalConfigApiData());
    }
  }, [
    dispatch,
    globalData.defaultLangData,
    globalData.globalCountries,
    globalData.isSuccess,
    globalData.loginDataUrl,
    loginLocaliseData.loginJsonPayload,
  ]);

  useEffect(() => {
    /**
     * Uncomment this isFocused code from everywhere
     */
    // if (isFocused) {
    if (countriesListData.isSuccess) {
      /* If countries list api is successful then store the country details of index 0 in reducer */
      dispatch(setSelectedCountry(countriesListPayload[0]));
      dispatch(clearCountriesListApiData());
    }
    if (loginLocaliseData.isSuccess) {
      dispatch(clearLoginConfigApiData());
    }
    if (translationData.isSuccess) {
      dispatch(clearTranslationApiData());
    }
    if (
      countriesListData.isError ||
      loginLocaliseData.isError ||
      translationData.isError ||
      globalData.isError
    ) {
      Alert.alert(
        'Error',
        'Failed to download the files. Please try again later',
        {
          text: 'OK',
          onPress: () => {
            dispatch(clearCountriesListApiData());
            dispatch(clearLoginConfigApiData());
            dispatch(clearTranslationApiData());
            dispatch(clearGlobalConfigApiData());

            // add code for exit from app here
            // You can use the library: https://github.com/wumke/react-native-exit-app
          },
        },
      );
    }
    // }
  }, [
    // isFocused,
    countriesListData.isError,
    countriesListData.isSuccess,
    countriesListPayload,
    dispatch,
    globalData.isError,
    loginLocaliseData.isError,
    loginLocaliseData.isSuccess,
    translationData.isError,
    translationData.isSuccess,
  ]);

  /**
   *  translationPayload: returns Array
   *  transData: returns object
   *  new LocalizedStrings(transData): Instance is created and stored the translations in reducer
   *  translations.setLanguage: First time UnitedKingdom EN is selected and after that the selected language is set
   *
   *  new LocalizedStrings(loginTransData): Instance is created for login translated data and stored in reducer
   */
  useEffect(() => {
    if (
      translationPayload &&
      translationPayload.length &&
      selectedLangData &&
      selectedLangData.countryLanguage
    ) {
      const transData = Object.assign({}, ...translationPayload);
      const translations = new LocalizedStrings(transData);
      dispatch(setAppTranslationData(translations));
      translations.setLanguage(selectedLangData.countryLanguage);
    }
    if (
      loginLocaliseData &&
      loginLocaliseData.loginJsonPayload &&
      selectedLangData &&
      selectedLangData.countryLanguage
    ) {
      const loginTransData =
        Platform.OS === 'android'
          ? loginLocaliseData.loginJsonPayload.android
          : loginLocaliseData.loginJsonPayload.ios;
      const loginTranslations = new LocalizedStrings(loginTransData);
      dispatch(setLoginTranslationData(loginTranslations));
      loginTranslations.setLanguage(selectedLangData.countryLanguage);
    }
  }, [
    dispatch,
    selectedLangData,
    loginLocaliseData,
    selectedLangData.countryLanguage,
    translationPayload,
  ]);

  const isLoading =
    globalData.isLoading ||
    countriesListData.isLoading ||
    loginLocaliseData.isLoading ||
    translationData.isLoading;
  return (
    <>
      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0c9" />
          <Text>Fetching Data</Text>
        </View>
      )}
      <View style={[styles.container, {paddingTop: 100}]}>
        <Text>Main</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  language: {
    paddingTop: 10,
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 70,
  },
});
