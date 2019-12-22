import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import Button from '~/components/Button';
import { Container, FormInput } from './styles';
import api from '~/services/api';

export default function NewQuestion({ navigation }) {
  const [question, setQuestion] = useState('');
  const student = useSelector(store => store.student.profile);

  async function handleSubmit() {
    try {
      await api.post(`students/${student.id}/help-orders`, {
        question,
      });
      navigation.navigate('HelpOrderList');
    } catch (err) {
      if (err.response && typeof err.response.data.error === 'string') {
        Alert.alert('Nova pergunta', err.response.data.error);
      } else {
        Alert.alert(
          'Nova pergunta',
          'Não foi possível inserir nova pergunta, verifique seus dados.',
        );
      }
    }
  }

  return (
    <Container>
      <FormInput
        multiline
        numberOfLines={22}
        textAlignVertical="top"
        placeholder="Inclua seu pedido de auxílio"
        value={question}
        onChangeText={setQuestion}
      />
      <Button onPress={handleSubmit}>Enviar pedido</Button>
    </Container>
  );
}

NewQuestion.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

NewQuestion.navigationOptions = ({ navigation }) => ({
  headerLeft: () => (
    <TouchableOpacity onPress={() => navigation.navigate('HelpOrderList')}>
      <Icon name="chevron-left" size={20} color="#000" />
    </TouchableOpacity>
  ),
});
