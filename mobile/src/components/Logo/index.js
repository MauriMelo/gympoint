import React from 'react';
import logo from '~/assets/logo.png';

import { Container, Text, Image } from './styles';

export default function Logo() {
  return (
    <Container>
      <Image source={logo} />
      <Text>GYMPOINT</Text>
    </Container>
  );
}
