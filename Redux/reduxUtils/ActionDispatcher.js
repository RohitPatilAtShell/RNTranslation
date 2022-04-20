/* eslint-disable eqeqeq */
import ErrorHandler from './Errors';

/**
 * This function handles API responses and return corresponding object for loading,success and error cases for that API.
 * It takes below params:
 * serviceMethod: It's a function that is used to make API call. It takes one mandatory parameter i.e. url and returns a promise.
 * actionTypeSuccess, actionTypeFailure, actionTypeSuccess: Action types used to handle API success and error cases.
 * extra: It's an extra parameter that is required for handling pagination etc. It's optional.
 * callback: It's an optional callbacl function
 */

function dispatchResponseToReducers(
  serviceMethod,
  actionTypeSuccess,
  actionTypeFailure,
  actionTypeInProgress,
  extra,
  callback,
) {
  let headers = null;
  return dispatch => {
    /**
     *  This is dispatched when API call is initiated
     *  Returns an object with type of action and extra param if passed
     */
    dispatch({
      type: actionTypeInProgress,
      extra: extra ? extra : undefined,
    });
    /**
     * It's function that is used to make API call
     * It takes one mandatory parameter i.e url and returns the promise.
     */
    serviceMethod()
      .then(response => {
        headers = response.headers;
        /**
         * Check where api succeeds to fetch data or not
         * If its success then  if condition will be executed otherwise else block will be executed
         */
        if (response.status == '200') {
          /**
           * If the response succeeds, it is dispatched
           * The action type may be instance of array or object
           * According to the type, corresponding if-else block is executed
           * Returns an object with success action type,
           * headers, payload that consist of data returned from that API
           * and extra params if passed to that action
           */
          if (actionTypeSuccess instanceof Array) {
            actionTypeSuccess.forEach(value => {
              dispatch({
                type: value,
                headers,
                payload: response.data,
                extra: extra ? extra : undefined,
              });
            });
            if (callback) {
              callback(response.status, response.message, response.data);
            }
          } else {
            dispatch({
              type: actionTypeSuccess,
              headers,
              payload: response.data,
              extra: extra ? extra : undefined,
            });
            if (callback) {
              callback(response.status, response.message, response.data);
            }
          }
        } else {
          /**
           * If the response gives failure, it is dispatched
           * The action type may be instance of array or object
           * According to the type, corresponding if-else block is executed
           * Returns an object with failure action type,
           * headers, payload that consist of error status and error data
           * and extra params if passed to that action
           */
          if (actionTypeFailure instanceof Array) {
            actionTypeFailure.forEach(value => {
              dispatch({
                type: value,
                error: response.status ? response.status : '',
                data: response.data ? response.data : {},
                message: response.message ? response.message : '',
              });
            });
            if (callback) {
              callback(response.status, response.message, response.data);
            }
          } else {
            dispatch({
              type: actionTypeFailure,
              error: response.status ? response.status : '',
              data: response.data ? response.data : {},
              message: response.message ? response.message : '',
            });
            if (callback) {
              callback(response.code, response.message, response.data);
            }
          }
        }
      })
      .catch(error => {
        const response = error.response
          ? error.response
          : ErrorHandler(error.message);

        /**
         * If the response gives failure, it is dispatched
         * The action type may be instance of array or object
         * According to the type, corresponding if-else block is executed
         * Returns an object with failure action type,
         * headers, payload that consist of error status and error data
         * and extra params if passed to that action
         */
        if (actionTypeFailure instanceof Array) {
          actionTypeFailure.forEach(value => {
            dispatch({
              type: value,
              error: response.status ? response.status : '',
              data: response.data ? response.data : {},
              message: response.message ? response.message : '',
            });
          });
          if (callback) {
            callback(response.status, response.message, response.data);
          }
        } else {
          dispatch({
            type: actionTypeFailure,
            error: response.status ? response.status : '',
            data: response.data ? response.data : {},
            message: response.message ? response.message : '',
          });
          if (callback) {
            callback(response.status, response.message, response.data);
          }
        }
      });
  };
}

export default dispatchResponseToReducers;
