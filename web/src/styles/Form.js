import styled, { createGlobalStyle } from 'styled-components';
import colors from '~/styles/colors';

export default createGlobalStyle`
  .form-control {
    border: 1px solid #dddddd;
    height: 46px;
    font-size: 16px;
    color: #999;
    border-radius: 5px;
    width: 100%;
    padding: 10px 12px;
    transition: 0.5s border;
    background: white;
    &::placeholder {
      color: #999;
    }
    &[disabled] {
      background-color: whitesmoke;
    }
  }

  .form-control + span {
    color: #ff4d67;
    display: inline-block;
    font-size: 13px;
    margin-top: 5px;
  }

  .form-control--small {
    height: 40px;
    padding: 8px 10px;
    font-size: 15px;
  }

  .form-control:focus {
    border-color: ${colors.primary};
  }

  .form-label {
    display: block;
    font-weight: bold;
    color: #444;
    margin-bottom: 5px;

  }

`;

export const FormControlIcon = styled.div`
  position: relative;
  > svg {
    position: absolute;
    pointer-events: none;
    top: 50%;
    transform: translate(0, -50%);
    margin-left: 12px;
  }
  > input {
    padding-left: 35px;
  }
`;
