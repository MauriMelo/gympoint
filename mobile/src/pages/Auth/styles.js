import { Platform } from 'react-native';
import styled from 'styled-components/native';
import Button from '~/components/Button';
import Input from '~/components/Input';

export const Container = styled.KeyboardAvoidingView.attrs({
  enable: Platform.OS === 'ios',
  behavior: Platform.OS === 'ios' ? 'padding' : 'height',
})`
  flex: 1;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  padding: 0 20px;
`;

export const Logo = styled.Image`
  width: 115px;
  height: 72px;
  margin-bottom: 20px;
`;

export const FormInput = styled(Input)`
  margin-bottom: 15px;
`;

export const SubmitButton = styled(Button)`
  width: 100%;
`;
