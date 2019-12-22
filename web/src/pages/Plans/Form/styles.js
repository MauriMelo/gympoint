import styled from 'styled-components';
import { Grid } from '~/styles/Grid';

export const Container = styled.div`
  max-width: 960px;
  margin: 30px auto 0;
`;
export const Actions = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  > button {
    margin-left: 15px;
  }
`;
export const Header = styled.div`
  display: flex;
  align-items: center;
`;

export const Content = styled.div`
  background: white;
  padding: 30px;
  border-radius: 5px;
  margin-top: 20px;

  ${Grid} {
    margin-bottom: 20px;
  }

  ${Grid}:last-child {
    margin-bottom: 0;
  }
`;
