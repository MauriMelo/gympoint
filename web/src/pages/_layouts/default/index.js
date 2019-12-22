import React from 'react';
import propTypes from 'prop-types';
import { Container } from './styles';
import Header from '~/components/Header';

export default function DefaultLayout({ children }) {
  return (
    <Container>
      <Header />
      {children}
    </Container>
  );
}

DefaultLayout.propTypes = {
  children: propTypes.element.isRequired
};
