import axios from 'axios';
import Config from 'react-native-config';

export default axios.create({
  baseURL: Config.APP_API_URL,
});
