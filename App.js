import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationNativeContainer} from '@react-navigation/native';
import React from 'react';
import {Platform, StatusBar} from 'react-native';
import {ThemeProvider} from 'react-native-elements';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {LocalizationProvider} from './components/Translations';
import {Home} from './screens/Home';
import {Settings} from './screens/Settings';
import {persistor, store} from './Redux/store/configureStore';
import {Main} from './screens/Main';
import { Login } from './screens/Login';

const Tab = createBottomTabNavigator();

const isIOS = Platform.OS === 'ios';

const App = () => (
  <>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationNativeContainer>
          <StatusBar barStyle="dark-content" />
          <SafeAreaProvider>
            <LocalizationProvider>
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
                      return (
                        <Ionicons name={iconName} size={size} color={color} />
                      );
                    },
                  })}
                  tabBarOptions={{
                    activeTintColor: 'tomato',
                    inactiveTintColor: 'gray',
                  }}>
                  <Tab.Screen name="Home" component={Home} />
                 <Tab.Screen name="Main" component={Main} />
                 <Tab.Screen name="Login" component={Login} />
                  <Tab.Screen name="Settings" component={Settings} />
                </Tab.Navigator>
              </ThemeProvider>
            </LocalizationProvider>
          </SafeAreaProvider>
        </NavigationNativeContainer>
      </PersistGate>
    </Provider>
  </>
);

export default App;
