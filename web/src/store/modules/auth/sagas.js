import { all, takeLatest, put, call } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { signInSuccess, signInFailure } from '~/store/modules/auth/actions';
import api from '~/services/api';
import history from '~/services/history';

export function* signIn({ payload }) {
  const { email, password } = payload;
  try {
    const formData = new URLSearchParams();

    formData.append('email', email);
    formData.append('password', password);

    const response = yield call(api.post, 'sessions', formData);

    const { token, user } = response.data;
    api.defaults.headers.Authorization = ` Bearer ${token}`;

    yield put(signInSuccess(token, user));
    history.push('/alunos');
  } catch (err) {
    yield put(signInFailure());
    toast.error('Falha na autenticação, verifique seus dados');
  }
}

export function setToken({ payload }) {
  if (payload) {
    const { token } = payload.auth;
    api.defaults.headers.Authorization = ` Bearer ${token}`;
  }
}

export function signOut() {
  history.push('/');
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_OUT', signOut)
]);
