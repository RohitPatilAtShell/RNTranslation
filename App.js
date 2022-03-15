import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationNativeContainer} from '@react-navigation/native';
import React from 'react';
import {Platform, StatusBar} from 'react-native';
import {ThemeProvider} from 'react-native-elements';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TranslationProvider} from '@sede-x/translation';
import {Home} from './screens/Home';
import {Settings} from './screens/Settings';

import en from './localization/en.json';
import ru from './localization/ru.json';
import ar from './localization/ar.json';
import hi from './localization/hi.json';
import mr from './localization/mr.json';

const Tab = createBottomTabNavigator();

const isIOS = Platform.OS === 'ios';

const DEFAULT_LANGUAGE = 'en';

const languages = {en, ru, ar, hi, mr};

const App = () => (
  <>
    <NavigationNativeContainer>
      <StatusBar barStyle="dark-content" />
      <SafeAreaProvider>
        <TranslationProvider
          defaultTranslations={languages}
          language={DEFAULT_LANGUAGE}>
          <ThemeProvider>
            <Tab.Navigator
              screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                  let iconName;
                  if (route.name === 'Home') {
                    iconName = `${isIOS ? 'ios' : 'md'}-information-circle${
                      focused ? '' : '-outline'
                    }`;
                  } else if (route.name === 'Settings') {
                    iconName = `${isIOS ? 'ios' : 'md'}-options`;
                  }
                  // You can return any component that you like here!
                  return <Ionicons name={iconName} size={size} color={color} />;
                },
              })}
              tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
              }}>
              <Tab.Screen name="Home" component={Home} />
              <Tab.Screen name="Settings" component={Settings} />
            </Tab.Navigator>
          </ThemeProvider>
        </TranslationProvider>
      </SafeAreaProvider>
    </NavigationNativeContainer>
  </>
);

export default App;
