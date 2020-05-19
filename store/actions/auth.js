import { AsyncStorage } from 'react-native';

export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

export const authenticate = (userId, token, expiryTime) => {
  return dispatch => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({type: AUTHENTICATE, userId, token});
  }
  return {
    type: AUTHENTICATE,
    userId,
    token
  }
};

export const signup = (email, password) => {
  return async dispatch => {
    const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBU7uJNDl3C2_1iZevr7J9KLNXy5bVBhck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true
      })
    });

    if(!response.ok) {
      const errorResData = await response.json();
      // console.log(errorResData);
      throw new Error(errorResData.error.message);
    }

    const resData = await response.json();
    // console.log(resData)
    dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn)* 1000))
    // dispatch({
    //   type: SIGNUP,
    //   token: resData.idToken,
    //   userId: resData.localId
    // });
    const expirationDate = new Date(new Date().getTime()+ parseInt(resData.expiresIn));
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const login = (email, password) => {
  return async dispatch => {
    const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBU7uJNDl3C2_1iZevr7J9KLNXy5bVBhck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true
      })
    });

    if(!response.ok) {
      const errorResData = await response.json();
      // console.log(errorResData);
      throw new Error(errorResData.error.message);
    }

    const resData = await response.json();
    // console.log(resData)
    dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn)* 1000))
    // dispatch({
    //   type: LOGIN,
    //   token: resData.idToken,
    //   userId: resData.localId
    // });
    const expirationDate = new Date(new Date().getTime()+ parseInt(resData.expiresIn));
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');
  return {
    type: LOGOUT
  };
};

const clearLogoutTimer = () => {
  if(timer) {
    clearTimeout(timer);
  };
};

const setLogoutTimer = expirationTime => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logout());
    },expirationTime);
  };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem('userData', JSON.stringify({
    token: token,
    userId: userId,
    expiryDate: expirationDate.toISOString()
  }))
};