import { all, takeLatest, put, call } from 'redux-saga/effects';
import { Alert } from 'react-native';
import { signInSuccess, signInFailure } from './actions';
import api from '~/services/api';

export function* signIn({ payload }) {
  const { student_id } = payload;
  try {
    const response = yield call(api.post, 'sessions/student', {
      id: student_id,
    });

    const { student } = response.data;

    yield put(signInSuccess(student));
  } catch (err) {
    if (err.response && typeof err.response.data.error === 'string') {
      Alert.alert('Autenticação', err.response.data.error);
    } else {
      Alert.alert(
        'Autenticação',
        'Falha na autenticação, verifique seus dados',
      );
    }
    yield put(signInFailure());
  }
}

export default all([takeLatest('@auth/SIGN_IN_REQUEST', signIn)]);
