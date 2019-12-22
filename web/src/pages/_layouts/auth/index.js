import React from 'react';
import propTypes from 'prop-types';
import { Container, Content } from './styles';

export default function AuthLayout({ children }) {
  return (
    <Container>
      <Content>{children}</Content>
    </Container>
  );
}

AuthLayout.propTypes = {
  children: propTypes.element.isRequired
};
