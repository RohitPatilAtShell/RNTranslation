import {applyMiddleware, createStore, compose} from 'redux';
import {logger} from 'redux-logger';
import {persistStore, persistReducer} from 'redux-persist';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/index';
import AsyncStorage from '@react-native-community/async-storage';

const middlewares = [thunk];
if (__DEV__) {
  middlewares.push(logger);
}

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const configureStore = () => {
  const reduxStore = createStore(
    persistedReducer,
    {},
    compose(applyMiddleware(...middlewares)),
  );
  const reduxPersistor = persistStore(reduxStore);
  return {reduxStore, reduxPersistor};
};

const {reduxStore: store, reduxPersistor: persistor} = configureStore();

export {store, persistor};
