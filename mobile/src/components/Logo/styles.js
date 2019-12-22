import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
`;
export const Image = styled.Image.attrs({
  resizeMode: 'contain',
})`
  width: 40px;
  height: 20px;
  margin-right: 10px;
`;
export const Text = styled.Text`
  font-weight: bold;
  font-size: 14px;
  color: #ee4e62;
`;
