import { createGlobalStyle } from 'styled-components';

import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap');
  *{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    outline: none;
  }

  &:focys{
    outline: none;
  }

  html, body, #root, input{
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
  }

  html, body, #root {
    height: 100%;
  }

  body{
    -webkit-font-smoothing: antialiased;
  }

  a{
    text-decoration: none;
  }

  ul{
    list-style: none;
  }

  button {
    cursor: pointer;
  }

  h1, h2, h3, h4, h5, h6 {
    color: #444;
    font-weight: bold;
  }

  h1 {
    font-size: 24px;
  }

`;
