import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatRelative, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import PropTypes from 'prop-types';
import {
  Container,
  Header,
  Time,
  Text,
  Title,
  Question,
  AnswerContainer,
} from './styles';

export default function Answer({ navigation }) {
  const question = navigation.getParam('question');

  return (
    <Container>
      <Question>
        <Header>
          <Title>PERGUNTA</Title>
          <Time>
            {formatRelative(parseISO(question.created_at), new Date(), {
              locale: pt,
            })}
          </Time>
        </Header>
        <Text>{question.question}</Text>
        {question.answer ? (
          <AnswerContainer>
            <Header>
              <Title>RESPOSTA</Title>
            </Header>
            <Text>{question.answer}</Text>
          </AnswerContainer>
        ) : null}
      </Question>
    </Container>
  );
}

Answer.navigationOptions = ({ navigation }) => ({
  headerLeft: () => (
    <TouchableOpacity onPress={() => navigation.navigate('HelpOrderList')}>
      <Icon name="chevron-left" size={20} color="#000" />
    </TouchableOpacity>
  ),
});

Answer.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};
