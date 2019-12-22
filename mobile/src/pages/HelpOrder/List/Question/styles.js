import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  background: white;
  border-radius: 5px;
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #ddd;
`;
export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;
export const Title = styled.Text`
  font-weight: bold;
  color: ${props => (props.answered ? '#42cb59' : '#999')};
  font-size: 14px;
  margin-left: 10px;
`;
export const Text = styled.Text`
  color: #666;
  font-size: 14px;
  line-height: 22;
`;
export const Time = styled.Text`
  font-size: 12px;
  text-align: right;
  margin-left: auto;
  color: #666;
`;
