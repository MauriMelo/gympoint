import styled from 'styled-components';

export default {
  control: provided => ({
    ...provided,
    border: '1px solid #dddddd',
    height: '46px',
    fontSize: '16px',
    color: '#999',
    borderRadius: '5px',
    width: '100%',
    paddingLeft: '5px',
    transition: '0.5s border',
    background: 'white'
  })
};

export const Error = styled.span`
  color: #ff4d67;
  display: inline-block;
  font-size: 13px;
  margin-top: 5px;
`;
