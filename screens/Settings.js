import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {ListItem, Text} from 'react-native-elements';
import {useSafeArea} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {LocalizationContext} from '../components/Translations';

const fetchAppConfigData = async () => {
  const res = await fetch(
    'https://rohitpatilatshell.github.io/RNTranslation/localization/appSettings.json',
  );
  const json = await res.json();
  console.log('json in fetch data is : ', json);
  return json;
};

const fetchData = async () => {
  const res = await fetch(
    'https://rohitpatilatshell.github.io/RNTranslation/localization/en/en.json',
    // 'https://jsonplaceholder.typicode.com/users',
  );
  const json = await res.json();
  console.log('json in fetch data is : ', json);
  return json;
};

export const Settings = () => {
  const [appData, setAppData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const localizationData = useSelector(state => state.localizationReducer);
  const {appTranslationData} = localizationData;

  useEffect(() => {
    fetchAppConfigData().then(data => {
      console.log('setting app data is : ', data);
      setAppData(data); //sets the data to appear
      setLoading(false); //stop loading when data is fetched
    });
  }, []);

  const insets = useSafeArea();
  const {
    translations,
    appLanguage,
    setAppLanguage,
    initializeAppLanguage,
  } = useContext(LocalizationContext);
  initializeAppLanguage();

  console.log('appData is : ', appData);

  return isLoading ? (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color="#0c9" />
      <Text>Fetching Data</Text>
    </View>
  ) : (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <Text h4 h4Style={styles.language}>
        {translations['settings.change_language']}
      </Text>

      <Text h4 h4Style={styles.language}>
        {appTranslationData.translationData.Menu['About_this_app?']}
      </Text>
      <Text h4 h4Style={styles.language}>
        {appTranslationData.translationData.Others['201']}
      </Text>
      {translations.getAvailableLanguages().map((currentLang, i) => (
        <ListItem
          key={i}
          title={currentLang}
          bottomDivider
          checkmark={appLanguage === currentLang}
          onPress={() => {
            setAppLanguage(currentLang);
          }}
        />
      ))}
    </View>
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
