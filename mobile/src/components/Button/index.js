import React from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { Container, Text } from './styles';

export default function Button({ loading, children, ...rest }) {
  return (
    <Container loading={loading} {...rest}>
      {loading ? (
        <ActivityIndicator color="#FFF" size={20} />
      ) : (
        <Text>{children}</Text>
      )}
    </Container>
  );
}

Button.propTypes = {
  loading: PropTypes.bool,
  children: PropTypes.string.isRequired,
};

Button.defaultProps = {
  loading: false,
};
