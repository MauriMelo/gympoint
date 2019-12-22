import React, { useRef, useEffect } from 'react';
import Select from 'react-select/async';
import propsTypes from 'prop-types';

import { useField } from '@rocketseat/unform';
import styles, { Error } from './styles';

export default function AsyncSelect({ name, loadOptions, multiple, ...rest }) {
  const ref = useRef(null);
  const { fieldName, registerField, error } = useField(name);

  function parseSelectValue(selectRef) {
    const selectValue = selectRef.props.value;
    if (!multiple) {
      return selectValue || '';
    }
    return selectValue || [];
  }

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'state.value',
      parseValue: parseSelectValue,
      clearValue: selectRef => {
        selectRef.select.clearValue();
      }
    });
  }, [ref.current, fieldName]); // eslint-disable-line

  return (
    <>
      <Select
        name={fieldName}
        loadOptions={loadOptions}
        isMulti={multiple}
        ref={ref}
        styles={styles}
        {...rest}
      />

      {error && <Error>{error}</Error>}
    </>
  );
}

AsyncSelect.propTypes = {
  name: propsTypes.string.isRequired,
  loadOptions: propsTypes.func.isRequired,
  multiple: propsTypes.bool
};

AsyncSelect.defaultProps = {
  multiple: false
};
