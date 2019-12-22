import React, { useEffect, useState } from 'react';
import { MdCheck, MdKeyboardArrowLeft } from 'react-icons/md';
import { Input, Form } from '@rocketseat/unform';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import propTypes from 'prop-types';
import NumberFormat from '~/components/NumberFormat';
import DefaultLayout from '~/pages/_layouts/default';
import { Container, Header, Actions, Content } from './styles';
import { Button } from '~/styles/Button';
import { Grid, Col } from '~/styles/Grid';
import api from '~/services/api';
import history from '~/services/history';

export default function StudentForm({ match }) {
  const { id } = match.params;

  const [student, setStudent] = useState({
    name: '',
    age: '',
    weight: 0,
    height: 0
  });

  const schema = Yup.object().shape({
    name: Yup.string().required('Campo nome obrigatório'),
    email: Yup.string()
      .email('Insira um e-mail válido')
      .required('Campo email obrigatório'),
    age: Yup.string(),
    weight: Yup.string(),
    height: Yup.string()
  });

  useEffect(() => {
    async function loadStudents() {
      try {
        const response = await api.get(`/students/${id}`);
        setStudent(response.data);
      } catch (err) {
        toast.error('Aluno não encontrado.');
        history.push('/alunos');
      }
    }

    if (id) {
      loadStudents();
    }
  }, [id]);

  async function handleSubmit(data) {
    if (id) {
      try {
        await api.put(`/students/${id}`, {
          ...data,
          age: parseInt(data.age, 10),
          weight: parseFloat(data.weight),
          height: parseFloat(data.height)
        });
        history.push('/alunos');
        toast.success('Aluno alterado com sucesso!');
      } catch (err) {
        if (err.response && err.response.data) {
          toast.error(err.response.data.error);
        } else {
          toast.error('Não foi possível atualizar aluno, verifique seus dados');
        }
      }
    } else {
      try {
        await api.post('/students', {
          ...data,
          age: parseInt(data.age, 10),
          weight: parseFloat(data.weight),
          height: parseFloat(data.height)
        });
        history.push('/alunos');
        toast.success('Aluno cadastrado com sucesso!');
      } catch (err) {
        if (err.response && err.response.data) {
          toast.error(err.response.data.error);
        } else {
          toast.error(
            'Não foi possível criar novo aluno, verifique seus dados'
          );
        }
      }
    }
  }

  return (
    <DefaultLayout>
      <Container>
        <Form initialData={student} schema={schema} onSubmit={handleSubmit}>
          <Header>
            <h1>{id ? 'Edição de aluno' : 'Cadastro de aluno'}</h1>
            <Actions>
              <Button.routerLink
                to="/alunos"
                size="small"
                icon="true"
                secondary="true"
              >
                <MdKeyboardArrowLeft size={20} />
                VOLTAR
              </Button.routerLink>
              <Button size="small" icon>
                <MdCheck size={20} />
                SALVAR
              </Button>
            </Actions>
          </Header>
          <Content>
            <Grid gutter="10px">
              <Col>
                <label className="form-label" htmlFor="name">
                  NOME COMPLETO
                </label>
                <Input className="form-control" name="name" id="name" />
              </Col>
            </Grid>
            <Grid gutter="10px">
              <Col>
                <label className="form-label" htmlFor="email">
                  ENDEREÇO DE E-MAIL
                </label>
                <Input
                  className="form-control"
                  name="email"
                  id="email"
                  type="email"
                />
              </Col>
            </Grid>
            <Grid gutter="10px">
              <Col>
                <label className="form-label" htmlFor="age">
                  IDADE
                </label>
                <Input
                  type="number"
                  id="age"
                  name="age"
                  className="form-control"
                  max="200"
                />
              </Col>
              <Col>
                <label className="form-label" htmlFor="weight">
                  PESO (em kg)
                </label>
                <NumberFormat
                  id="weight"
                  name="weight"
                  className="form-control"
                  decimalSeparator=","
                  thousandSeparator="."
                  suffix="kg"
                  maxLength="10"
                  value={parseFloat(student.weight)}
                />
              </Col>
              <Col>
                <label className="form-label" htmlFor="height">
                  ALTURA
                </label>
                <NumberFormat
                  id="height"
                  name="height"
                  className="form-control"
                  decimalSeparator=","
                  thousandSeparator="."
                  suffix=" m"
                  maxLength="10"
                  value={parseFloat(student.height)}
                />
              </Col>
            </Grid>
          </Content>
        </Form>
      </Container>
    </DefaultLayout>
  );
}

StudentForm.propTypes = {
  match: propTypes.shape({
    params: propTypes.shape({
      id: propTypes.string
    })
  })
};

StudentForm.defaultProps = {
  match: propTypes.shape({
    params: propTypes.shape({
      id: null
    })
  })
};
