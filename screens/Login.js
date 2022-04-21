import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
  Text,
  Alert,
} from 'react-native';
import {useSafeArea} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {DropdownComponent} from './Dropdown/Dropdown';
import {
  clearTranslationApiData,
  fetchTranslations,
  setAppTranslationData,
  setLoginTranslationData,
  setSelectedCountry,
  setSelectedCountryLanguage,
} from '../Redux/actions/localizationActions';
import LocalizedStrings from 'react-native-localization';

export const Login = () => {
  const dispatch = useDispatch();
  const localizationData = useSelector(state => state.localizationReducer);
  const {
    globalData: {globalCountries},
    countriesListData: {countriesListPayload},
    selectedCountryData,
    selectedLangData,
    translationData,
    translationData: {translationPayload},
    loginTranslationData,
    loginLocaliseData,
  } = localizationData;

  if (globalCountries && globalCountries.length) {
    globalCountries.sort((a, b) => {
      if (a.countryLanguage < b.countryLanguage) {
        return -1;
      }
      if (a.countryLanguage > b.countryLanguage) {
        return 1;
      }
      return 0;
    });
  }

  const [selectedCountry, setCountry] = useState(selectedCountryData);
  const [selectedLang, setLanguage] = useState(selectedLangData);
  const [previousSelectedLanguage, setPreviousSelectedLanguage] = useState(
    selectedLangData,
  );

  const insets = useSafeArea();

  useEffect(() => {
    // Add isFocused code here as well as done on main screen
    if (translationData.isSuccess) {
      dispatch(clearTranslationApiData());
      const transData = Object.assign({}, ...translationPayload);
      const translations = new LocalizedStrings(transData);
      dispatch(setAppTranslationData(translations));
      translations.setLanguage(selectedLang.countryLanguage);
      const loginTransData =
        Platform.OS === 'android'
          ? loginLocaliseData.loginJsonPayload.android
          : loginLocaliseData.loginJsonPayload.ios;
      const loginTranslations = new LocalizedStrings(loginTransData);
      dispatch(setLoginTranslationData(loginTranslations));
      loginTranslations.setLanguage(selectedLang.countryLanguage);
    }
  }, [
    dispatch,
    loginLocaliseData.loginJsonPayload.android,
    loginLocaliseData.loginJsonPayload.ios,
    loginTranslationData,
    selectedLang.countryLanguage,
    translationData.isSuccess,
    translationPayload,
  ]);

  useEffect(() => {
    // Add isFocused code here as well as done on main screen to avoid multiple popups
    if (translationData.isError) {
      dispatch(clearTranslationApiData());
      setLanguage(previousSelectedLanguage);
      dispatch(setSelectedCountryLanguage(previousSelectedLanguage));
      const loginTransData =
        Platform.OS === 'android'
          ? loginLocaliseData.loginJsonPayload.android
          : loginLocaliseData.loginJsonPayload.ios;
      const loginTranslations = new LocalizedStrings(loginTransData);
      dispatch(setLoginTranslationData(loginTranslations));
      loginTranslations.setLanguage(previousSelectedLanguage.countryLanguage);
      Alert.alert(
        '',
        `${loginTranslations['Translation_Files_Download_Error']} ${
          selectedLang.countryLanguage
        }`,
      );
    }
  }, [
    dispatch,
    loginLocaliseData.loginJsonPayload.android,
    loginLocaliseData.loginJsonPayload.ios,
    loginTranslationData,
    previousSelectedLanguage,
    selectedLang.countryLanguage,
    translationData.isError,
  ]);

  return (
    <>
      {translationData.isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0c9" />
          <Text>Fetching Data</Text>
        </View>
      )}
      <View style={[styles.container, {paddingTop: insets.top}]}>
        <Text style={styles.language}>
          {loginTranslationData && loginTranslationData['country']}
        </Text>
        {countriesListPayload && countriesListPayload.length ? (
          <DropdownComponent
            data={countriesListPayload}
            selectItemHandle={(_index, option) => {
              setCountry(option);
              dispatch(setSelectedCountry(option));
            }}
            dropDownHeaderText={selectedCountry.countryName}
            selectedItem={selectedCountry.countryName}
            label={'countryName'}
          />
        ) : null}

        <Text style={styles.language}>
          {loginTranslationData && loginTranslationData['settings_country']}
        </Text>
        <DropdownComponent
          data={globalCountries}
          selectItemHandle={(_index, option) => {
            /* Set the selected language in local state and reducer */
            setLanguage(prevState => {
              setPreviousSelectedLanguage(prevState); // store the previous lang to update the reducer with the prev lang in case of error
              return option;
            });
            dispatch(setSelectedCountryLanguage(option));
            /* Update the language of login translation to the selected language to display on the screen before any api call is made */
            loginTranslationData.setLanguage(option.countryLanguage);

            /* Check if translation file for selected language already there in reducer
             * If yes, then the data will be fetched from reducer and translations.setLanguage will update the localization language
             * If no, then translation api will be called
             */
            const traslationExist = translationPayload.some(trans => {
              if (trans[option.countryLanguage] !== undefined) {
                return true;
              }
            });
            if (!traslationExist) {
              const langObj =
                Platform.OS === 'android' ? option.android : option.iOS;
              dispatch(fetchTranslations(langObj, option));
            } else {
              const transData = Object.assign({}, ...translationPayload);
              const translations = new LocalizedStrings(transData);
              translations.setLanguage(option.countryLanguage);
              dispatch(setAppTranslationData(translations));
            }
          }}
          dropDownHeaderText={selectedLang.countryLanguage}
          selectedItem={selectedCountry.countryLanguage}
          label={'countryLanguage'}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  language: {
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 70,
  },
});
