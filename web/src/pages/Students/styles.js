import styled from 'styled-components';
import { FormControlIcon } from '~/styles/Form';

export const Container = styled.div`
  max-width: 1200px;
  margin: 30px auto 0;
  padding: 0 15px;
`;
export const Actions = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  > ${FormControlIcon} {
    width: 280px;
    margin: 0 0 0 15px;
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
`;

export const RemoveEnrollmentsConfirm = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0;
  input {
    margin-right: 5px;
  }
`;
