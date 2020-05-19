export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';

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

    dispatch({
      type: SIGNUP,
      token: resData.idToken,
      userId: resData.localId
    });
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

    dispatch({
      type: LOGIN,
      token: resData.idToken,
      userId: resData.localId
    });
  };
};