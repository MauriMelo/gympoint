import styled from 'styled-components/native';

export const Container = styled.ScrollView`
  flex: 1;
  background: #f5f5f5;
  padding: 80px 20px 0;
  margin-bottom: 0px;
`;

export const Question = styled.View`
  background: white;
  border-radius: 5px;
  margin-bottom: 100px;
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
  color: #444;
  font-size: 14px;
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

export const AnswerContainer = styled.View`
  margin-top: 20px;
`;
