import React, { useEffect, useState } from 'react';
import { withNavigationFocus } from 'react-navigation';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import api from '~/services/api';
import Question from './Question';
import { Container, NewQuestion, QuestionList } from './styles';

function HelpOrder({ navigation, isFocused }) {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(null);
  const student = useSelector(store => store.student.profile);

  useEffect(() => {
    async function loadOrders() {
      setPage(1);
      const { data } = await api.get(`/students/${student.id}/help-orders`);
      const { orders: newOrders, pagination } = data;
      setOrders(newOrders);
      setPages(pagination.pages);
    }

    if (isFocused) {
      loadOrders();
    }
  }, [isFocused, student]);

  function handleNewQuestion() {
    navigation.navigate('HelpOrderNewQuestion');
  }

  async function handleNextPage() {
    if (page >= pages) return;
    const { data } = await api.get(`/students/${student.id}/help-orders`, {
      params: {
        page: page + 1,
      },
    });
    const { orders: newOrders, pagination } = data;
    setOrders([...orders, ...newOrders]);
    setPages(pagination.pages);
    setPage(pagination.page);
  }

  return (
    <Container>
      <NewQuestion onPress={handleNewQuestion}>
        Novo pedido de auxílio
      </NewQuestion>
      {orders.length > 0 && (
        <QuestionList
          data={orders}
          keyExtractor={item => String(item.id)}
          onEndReached={handleNextPage}
          renderItem={({ item: question }) => (
            <Question
              data={question}
              onPress={() =>
                navigation.navigate('HelpOrderAnswer', { question })
              }
            />
          )}
        />
      )}
    </Container>
  );
}

HelpOrder.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  isFocused: PropTypes.bool,
};

HelpOrder.defaultProps = {
  isFocused: false,
};

export default withNavigationFocus(HelpOrder);
