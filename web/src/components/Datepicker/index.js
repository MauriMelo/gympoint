import React, { useRef, useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import propTypes from 'prop-types';
import { useField } from '@rocketseat/unform';

import { Error } from './styles';

export default function DatePicker({ name, ...rest }) {
  const ref = useRef(null);
  const { fieldName, registerField, defaultValue, error } = useField(name);
  const [selected, setSelected] = useState(defaultValue);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'props.selected',
      clearValue: pickerRef => {
        pickerRef.clear();
      }
    });
  }, [ref.current, fieldName]); // eslint-disable-line

  return (
    <>
      <ReactDatePicker
        name={fieldName}
        selected={selected}
        onChange={date => setSelected(date || null)}
        ref={ref}
        {...rest}
      />
      {error && <Error>{error}</Error>}
    </>
  );
}

DatePicker.propTypes = {
  name: propTypes.string.isRequired
};
