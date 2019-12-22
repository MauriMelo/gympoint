import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  .table {
    border-collapse: collapse;
  }
  .table th{
    font-weight: bold;
    color: #444;
    font-size: 16px;
  }

  .table tr {
    border-bottom: 1px solid #eee;
  }

  .table tr:last-child {
    border-bottom: 0;
  }

  .table td {
    color: #666;
    font-size: 16px;
    padding: 16px 0;
  }

`;
