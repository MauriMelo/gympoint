import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled(RectButton)`
  background: #ee4d64;
  padding: 10px 10px;
  border-radius: 5px;
  opacity: ${props => (props.loading ? 0.6 : 1)};
`;

export const Text = styled.Text`
  font-size: 16px;
  color: #fff;
  font-weight: bold;
  text-align: center;
`;
