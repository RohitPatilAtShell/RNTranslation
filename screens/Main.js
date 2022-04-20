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

  useEffect(() => {
    if (globalData.isSuccess) {
      !loginLocaliseData.loginJsonPayload &&
        globalData.loginDataUrl &&
        dispatch(getLoginLocalizationData(globalData.loginDataUrl));
      const defaultLang =
        globalData.defaultLangData &&
        globalData.defaultLangData.Languages &&
        globalData.defaultLangData.Languages.length &&
        globalData.defaultLangData.Languages.find(
          lang => lang.code === DEFAULT_LANG_CODE,
        );
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
    if (countriesListData.isSuccess) {
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
      );
    }
  }, [
    countriesListData.isError,
    countriesListData.isSuccess,
    countriesListPayload,
    dispatch,
    globalData.isError,
    loginLocaliseData.isError,
    loginLocaliseData.isSuccess,
    translationData.isError,
    translationData.isSuccess,
    translationPayload,
  ]);

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
          console.log("loginTransData", loginTransData)
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
