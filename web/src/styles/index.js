import React from 'react';
import GlobalStyles from './Global';
import FormStyles from './Form';
import TableStyles from './Table';
import Utils from './Utils';

export default function Styles() {
  return (
    <>
      <GlobalStyles />
      <Utils />
      <FormStyles />
      <TableStyles />
    </>
  );
}
