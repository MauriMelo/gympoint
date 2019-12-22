export function signInRequest(email, password) {
  return {
    type: '@auth/SIGN_IN_REQUEST',
    payload: {
      email,
      password
    }
  };
}

export function signInSuccess(token, profile) {
  return {
    type: '@auth/SIGN_IN_SUCCESS',
    payload: {
      token,
      profile
    }
  };
}

export function signInFailure() {
  return {
    type: '@auth/SIGN_IN_FAILURE'
  };
}

export function signOut() {
  return {
    type: '@auth/SIGN_OUT'
  };
}
