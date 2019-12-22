import styled from 'styled-components';
import colors from '~/styles/colors';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: ${colors.primary};
`;

export const Content = styled.div`
  width: 360px;
  background: white;
  padding: 40px 30px;
  border-radius: 5px;
  box-shadow: 0 0 7px 0px rgba(0, 0, 0, 0.2);
`;
