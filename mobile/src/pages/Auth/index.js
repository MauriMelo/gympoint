import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import logo from '~/assets/logo-sign.png';
import { Container, Logo, SubmitButton, FormInput } from './styles';
import { signInRequest } from '~/store/modules/auth/actions';

export default function Auth() {
  const dispatch = useDispatch();
  const { loading } = useSelector(store => store.auth);
  const [studentId, setStudentId] = useState();

  function handleSubmit() {
    dispatch(signInRequest(studentId));
  }

  return (
    <Container>
      <Logo source={logo} />
      <FormInput
        returnKeyType="done"
        keyboardType="numeric"
        onSubmitEditing={handleSubmit}
        placeholder="Digite seu ID de cadastro"
        value={studentId}
        onChangeText={setStudentId}
      />
      <SubmitButton onPress={handleSubmit} loading={loading}>
        Entrar no sistema
      </SubmitButton>
    </Container>
  );
}
