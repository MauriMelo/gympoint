import styled, { createGlobalStyle, css } from 'styled-components';
import ReactModal from 'react-modal';

export const ModalStyle = styled(ReactModal)`
  background: white;
  width: 450px;
  border-radius: 5px;
  padding: 15px;
`;

export default createGlobalStyle`
  .modal-overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: rgba(0, 0, 0, 0.5);
  }

  ${props =>
    props.animationIn &&
    css`
      .ReactModal__Overlay--after-open {
        ${ModalStyle} {
          animation: 0.5s ${props.animationIn};
        }
      }
    `}
  ${props =>
    props.animationOut &&
    css`
      .ReactModal__Overlay--before-close {
        ${ModalStyle} {
          animation: 0.5s ${props.animationOut};
        }
      }
    `}
`;
