import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ListItem, Text} from 'react-native-elements';
import {useSafeArea} from 'react-native-safe-area-context';
import {LocalizationContext} from '../components/Translations';

const fetchData = async () => {
  const res = await fetch(
    'https://rohitpatilatshell.github.io/RNTranslation/en.json',
    // 'https://jsonplaceholder.typicode.com/users',
  );
  const json = await res.json();
  console.log('json in fetch data is : ', json);
  return json;
};

export const Settings = () => {
  const [appData, setAppData] = useState([]);

  useEffect(() => {
    fetchData().then(data => {
      console.log('setting app data is : ', data);
      setAppData(data);
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

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <Text h4 h4Style={styles.language}>
        {translations['settings.change_language']}
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
});
