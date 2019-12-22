import React, { useEffect, useState, useMemo } from 'react';
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

const INITIAL_PLAN = {
  title: '',
  duration: 1,
  price: 0
};

export default function PlanForm({ match }) {
  const { id } = match.params;

  const [plan, setPlan] = useState(INITIAL_PLAN);
  const [duration, setDuration] = useState(INITIAL_PLAN.duration);
  const [price, setPrice] = useState(INITIAL_PLAN.price);

  const schema = Yup.object().shape({
    title: Yup.string().required('Campo titulo obrigatório'),
    duration: Yup.string().required('Campo duração obrigatório'),
    price: Yup.string().required('Campo preço obrigatório')
  });

  useEffect(() => {
    async function loadPlan() {
      try {
        const response = await api.get(`/plans/${id}`);
        setPlan(response.data);
        setDuration(response.data.duration);
        setPrice(response.data.price);
      } catch (err) {
        toast.error('Plano não encontrado.');
        history.push('/planos');
      }
    }

    if (id) {
      loadPlan();
    }
  }, [id]);

  const total = useMemo(() => {
    return price * duration;
  }, [price, duration]);

  async function handleSubmit(data) {
    if (id) {
      try {
        await api.put(`/plans/${id}`, {
          ...data,
          duration: parseInt(data.duration, 10),
          price: parseFloat(data.price)
        });
        history.push('/planos');
        toast.success('Plano alterado com sucesso!');
      } catch (err) {
        if (err.response && err.response.data) {
          toast.error(err.response.data.error);
        } else {
          toast.error('Não foi possível atualizar plano, verifique seus dados');
        }
      }
    } else {
      try {
        await api.post('/plans', {
          ...data,
          duration: parseInt(data.duration, 10),
          price: parseFloat(data.price)
        });
        history.push('/planos');
        toast.success('Plano cadastrado com sucesso!');
      } catch (err) {
        if (err.response && err.response.data) {
          toast.error(err.response.data.error);
        } else {
          toast.error(
            'Não foi possível criar novo plano, verifique seus dados'
          );
        }
      }
    }
  }

  return (
    <DefaultLayout>
      <Container>
        <Form initialData={plan} schema={schema} onSubmit={handleSubmit}>
          <Header>
            <h1>{id ? 'Edição de plano' : 'Cadastro de plano'}</h1>
            <Actions>
              <Button.routerLink
                to="/planos"
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
                <label className="form-label" htmlFor="title">
                  TÍTULO DO PLANO
                </label>
                <Input className="form-control" name="title" id="title" />
              </Col>
            </Grid>
            <Grid gutter="10px">
              <Col>
                <label className="form-label" htmlFor="duration">
                  DURAÇÃO (em meses)
                </label>
                <Input
                  className="form-control"
                  name="duration"
                  id="duration"
                  type="number"
                  onChange={e => setDuration(e.target.value)}
                  max="200"
                  value={duration}
                />
              </Col>
              <Col>
                <label className="form-label" htmlFor="price">
                  PREÇO MENSAL
                </label>
                <NumberFormat
                  id="price"
                  name="price"
                  className="form-control"
                  decimalSeparator=","
                  thousandSeparator="."
                  prefix="R$ "
                  maxLength="10"
                  onChange={(valueFormatted, value) => setPrice(value)}
                  value={price}
                />
              </Col>
              <Col>
                <label className="form-label" htmlFor="total">
                  PREÇO TOTAL
                </label>
                <NumberFormat
                  id="total"
                  name="total"
                  className="form-control"
                  decimalSeparator=","
                  thousandSeparator="."
                  prefix="R$ "
                  maxLength="10"
                  value={total}
                  disabled
                />
              </Col>
            </Grid>
          </Content>
        </Form>
      </Container>
    </DefaultLayout>
  );
}

PlanForm.propTypes = {
  match: propTypes.shape({
    params: propTypes.shape({
      id: propTypes.string
    })
  })
};

PlanForm.defaultProps = {
  match: propTypes.shape({
    params: propTypes.shape({
      id: null
    })
  })
};
