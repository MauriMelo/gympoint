import styled from 'styled-components/native';
import Button from '~/components/Button';

export const Container = styled.SafeAreaView`
  flex: 1;
  background: #f5f5f5;
  padding: 70px 20px 0;
`;

export const Text = styled.Text`
  margin-top: 60px;
`;

export const NewCheckin = styled(Button)`
  margin-bottom: 20px;
`;
export const CheckinsList = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
})``;

export const Checkin = styled.View`
  flex-direction: row;
  justify-content: space-between;
  background: white;
  padding: 10px 15px;
  border-radius: 3px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
`;
export const TextCheckin = styled.Text`
  font-size: 14px;
  color: #444;
  font-weight: bold;
`;
export const Time = styled.Text`
  font-size: 14px;
  color: #666;
`;
