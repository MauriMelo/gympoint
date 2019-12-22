import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import reactotronSaga from 'reactotron-redux-saga';
import AsyncStorage from '@react-native-community/async-storage';
import Config from 'react-native-config';

if (Config.APP_ENV === 'DEV') {
  const tron = Reactotron.setAsyncStorageHandler(AsyncStorage)
    .configure({
      host: '192.168.0.17',
    })
    .useReactNative()
    .use(reactotronRedux())
    .use(reactotronSaga())
    .connect();

  tron.clear();
  console.tron = tron;
}
