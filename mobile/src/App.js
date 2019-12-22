import React from 'react';
import { useSelector } from 'react-redux';

import Routes from './routes';

import '~/config/ReactotronConfig';

export default function App() {
  const { signed } = useSelector(store => store.auth);

  const Router = Routes(signed);
  return <Router />;
}
