import { Platform } from 'react-native';
import styled from 'styled-components/native';
import Input from '~/components/Input';

export const Container = styled.KeyboardAvoidingView.attrs({
  enable: Platform.OS === 'ios',
  behavior: 'padding',
})`
  flex: 1;
  background: #f5f5f5;
  padding: 70px 20px 0;
`;

export const FormInput = styled(Input)`
  min-height: 100px;
  max-height: 300px;
  margin-bottom: 15px;
`;
