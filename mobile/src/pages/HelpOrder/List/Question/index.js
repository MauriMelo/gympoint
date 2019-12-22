import React from 'react';
import { formatRelative, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import { Container, Header, Time, Text, Title } from './styles';

export default function Question({ data, ...rest }) {
  return (
    <Container {...rest}>
      <Header>
        <Icon
          name="check-circle"
          size={16}
          color={data.answer ? '#42cb59' : '#999'}
        />
        <Title answered={data.answer}>
          {data.answer ? 'Respondido' : 'Sem resposta'}
        </Title>
        <Time>
          {formatRelative(parseISO(data.created_at), new Date(), {
            locale: pt,
          })}
        </Time>
      </Header>
      <Text numberOfLines={3}>{data.question}</Text>
    </Container>
  );
}

Question.propTypes = {
  data: PropTypes.shape({
    answer: PropTypes.string,
    question: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
};
