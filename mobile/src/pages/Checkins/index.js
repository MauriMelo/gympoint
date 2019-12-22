import React, { useEffect, useState } from 'react';
import { withNavigationFocus } from 'react-navigation';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Alert } from 'react-native';
import { formatRelative, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import {
  Container,
  NewCheckin,
  CheckinsList,
  Checkin,
  TextCheckin,
  Time,
} from './styles';
import api from '~/services/api';

function Checkins({ isFocused }) {
  const [checkins, setCheckins] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(null);
  const student = useSelector(store => store.student.profile);

  useEffect(() => {
    async function loadCheckins() {
      setPage(1);
      const { data } = await api.get(`/students/${student.id}/checkins`);
      setCheckins(data.checkins);
      setPages(data.pagination.pages);
    }

    if (isFocused) {
      loadCheckins();
    }
  }, [isFocused, student.id]);

  async function handleCheckin() {
    try {
      const { data } = await api.post(`/students/${student.id}/checkins`);
      setCheckins([...checkins, data]);
    } catch (err) {
      if (err.response && typeof err.response.data.error === 'string') {
        Alert.alert('Checkin', err.response.data.error);
      } else {
        Alert.alert('Checkin', 'Não foi possível realizar checkin');
      }
    }
  }

  async function handleNextPage() {
    if (page >= pages) return;
    const { data } = await api.get(`/students/${student.id}/checkins`, {
      params: {
        page: page + 1,
      },
    });
    const { checkins: newCheckins, pagination } = data;
    setCheckins([...checkins, ...newCheckins]);
    setPages(pagination.pages);
    setPage(pagination.page);
  }

  return (
    <Container>
      <NewCheckin onPress={handleCheckin}>Novo check-in</NewCheckin>
      <CheckinsList
        data={checkins}
        keyExtractor={item => String(item._id)}
        onEndReached={handleNextPage}
        renderItem={({ item, index }) => (
          <Checkin>
            <TextCheckin> Check-in #{index + 1}</TextCheckin>
            <Time>
              {formatRelative(parseISO(item.createdAt), new Date(), {
                locale: pt,
              })}
            </Time>
          </Checkin>
        )}
      />
    </Container>
  );
}

Checkins.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  isFocused: PropTypes.bool,
};

Checkins.defaultProps = {
  isFocused: false,
};

Checkins.navigationOptions = {
  tabBarLabel: 'Check-ins',
};

export default withNavigationFocus(Checkins);
