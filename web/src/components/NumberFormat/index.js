import React, { useRef, useEffect } from 'react';
import propTypes from 'prop-types';
import { useField } from '@rocketseat/unform';
import CurrencyInput from 'react-currency-input';

export default function NumberFormat({ name, value, ...rest }) {
  const ref = useRef(null);
  const { fieldName, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'state.value',
      clearValue: () => {}
    });
  }, [ref.current, fieldName]); // eslint-disable-line

  return <CurrencyInput ref={ref} {...rest} value={value} />;
}

NumberFormat.propTypes = {
  name: propTypes.string.isRequired,
  value: propTypes.number
};

NumberFormat.defaultProps = {
  value: 0
};
