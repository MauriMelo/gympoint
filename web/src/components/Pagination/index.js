import React from 'react';
import propTypes from 'prop-types';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/md';

import { Button } from './styles';

export default function Pagination({
  page,
  pages,
  total,
  handlePrev,
  handleNext
}) {
  return (
    <>
      {page > 1 && total ? (
        <Button onClick={() => handlePrev(page - 1)}>
          <MdKeyboardArrowLeft size="20" />
        </Button>
      ) : null}
      {page < pages && total ? (
        <Button onClick={() => handleNext(page + 1)}>
          <MdKeyboardArrowRight size="20" />
        </Button>
      ) : null}
    </>
  );
}

Pagination.propTypes = {
  page: propTypes.number.isRequired,
  pages: propTypes.number.isRequired,
  total: propTypes.number.isRequired,
  handlePrev: propTypes.func,
  handleNext: propTypes.func
};

Pagination.defaultProps = {
  handlePrev: () => {},
  handleNext: () => {}
};
