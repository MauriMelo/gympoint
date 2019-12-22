import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Form } from '@rocketseat/unform';
import * as Yup from 'yup';
import { FaCircleNotch } from 'react-icons/fa';
import Layout from '~/pages/_layouts/auth';
import logo from '~/assets/logo-sign.png';
import { Button } from '~/styles/Button';
import { Content } from './styles';
import { signInRequest } from '~/store/modules/auth/actions';

export default function Auth() {
  const dispatch = useDispatch();

  const { loading } = useSelector(state => state.auth);

  const schema = Yup.object().shape({
    email: Yup.string()
      .email('Insira um e-mail válido')
      .required('O e-mail é obrigatório'),
    password: Yup.string().required('A senha é obrigatória')
  });

  function handleSubmit({ email, password }) {
    dispatch(signInRequest(email, password));
  }

  return (
    <Layout>
      <Content>
        <Form schema={schema} onSubmit={handleSubmit}>
          <img src={logo} width="150" alt="gympoint" />
          <label className="form-label" htmlFor="email">
            SEU E-MAIL
          </label>
          <Input
            className="form-control"
            name="email"
            id="email"
            type="email"
          />
          <label className="form-label" htmlFor="password">
            SUA SENHA
          </label>
          <Input
            className="form-control"
            name="password"
            id="password"
            type="password"
          />
          <Button type="submit" loading={loading ? 1 : 0}>
            {loading ? <FaCircleNotch /> : 'Entrar no sistema'}
          </Button>
        </Form>
      </Content>
    </Layout>
  );
}
