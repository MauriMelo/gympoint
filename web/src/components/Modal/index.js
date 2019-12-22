import React from 'react';

import Global, { ModalStyle } from './styles';

export default function Modal({ animationIn, animationOut, ...rest }) {
  return (
    <>
      <ModalStyle
        overlayClassName="modal-overlay"
        closeTimeoutMS={400}
        {...rest}
      />
      <Global animationIn={animationIn} animationOut={animationOut} />
    </>
  );
}
