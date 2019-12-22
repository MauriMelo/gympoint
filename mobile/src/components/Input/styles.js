import styled from 'styled-components/native';

export const Container = styled.View`
  padding: 0 15px;
  background: white;
  min-height: 46px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex-direction: row;
`;
export const TInput = styled.TextInput.attrs({
  placeholderTextColor: '#999',
})`
  flex: 1;
  font-size: 16px;
  color: #999;
`;
