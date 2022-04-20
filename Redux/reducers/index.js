import {combineReducers} from 'redux';
import localizationReducer from './localizationReducer';

/**
 * export the reducers of the application
 */
const appReducer = combineReducers({
  localizationReducer,
});

const rootReducer = (state, action) => {
  // Clear all data in redux store to initial.
  // if (action.type === DESTROY_SESSION) state = undefined;

  return appReducer(state, action);
};

export default rootReducer;
