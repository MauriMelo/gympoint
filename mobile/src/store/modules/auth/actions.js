export function signInRequest(student_id) {
  return {
    type: '@auth/SIGN_IN_REQUEST',
    payload: {
      student_id,
    },
  };
}

export function signInSuccess(profile) {
  return {
    type: '@auth/SIGN_IN_SUCCESS',
    payload: {
      profile,
    },
  };
}

export function signInFailure() {
  return {
    type: '@auth/SIGN_IN_FAILURE',
  };
}
