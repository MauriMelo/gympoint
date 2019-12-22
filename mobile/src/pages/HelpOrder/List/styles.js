import styled from 'styled-components/native';
import Button from '~/components/Button';

export const Container = styled.View`
  flex: 1;
  background: #f5f5f5;
  padding: 70px 20px 0;
`;

export const NewQuestion = styled(Button)`
  margin-bottom: 15px;
`;
export const QuestionList = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
})``;
