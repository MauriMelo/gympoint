import React, { useEffect, useState, useMemo } from 'react';
import { MdCheck, MdKeyboardArrowLeft } from 'react-icons/md';
import { Input, Form } from '@rocketseat/unform';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import propTypes from 'prop-types';
import { addMonths, format, parseISO } from 'date-fns';
import AsyncSelect from '~/components/AsyncSelect';
import NumberFormat from '~/components/NumberFormat';
import DefaultLayout from '~/pages/_layouts/default';
import { Container, Header, Actions, Content } from './styles';
import { Button } from '~/styles/Button';
import { Grid, Col } from '~/styles/Grid';
import api from '~/services/api';
import history from '~/services/history';
import Datepicker from '~/components/Datepicker';

export default function EnrollmentForm({ match }) {
  const { id } = match.params;

  const [loading, setLoading] = useState(true);
  const [enrollment, setEnrollment] = useState({
    student: null,
    plan: null,
    startDate: null
  });
  const [plans, setPlans] = useState([]);

  const schema = Yup.object().shape({
    student: Yup.object({
      id: Yup.number().required(),
      name: Yup.string().required()
    })
      .nullable()
      .required('Campo aluno obrigatório'),
    plan: Yup.object({
      id: Yup.number().required(),
      title: Yup.string().required()
    })
      .nullable()
      .required('Campo plano obrigatório'),
    startDate: Yup.date()
      .required('Campo data de início obrigatório')
      .typeError('Campo data inválida')
  });

  const studentPromise = value =>
    api
      .get('/students', {
        params: {
          q: value
        }
      })
      .then(({ data }) => data.students)
      .catch(() => []);

  const plansPromise = async value => {
    return new Promise(resolve => {
      const data = plans.filter(
        item => !value || item.title.toLowerCase().search(value) >= 0
      );

      resolve(data);
    });
  };

  useEffect(() => {
    async function loadPlans() {
      try {
        const { data } = await api.get('/plans');
        setPlans(data.plans);
      } catch (err) {
        setPlans([]);
      }
      setLoading(false);
    }

    loadPlans();
  }, []);

  useEffect(() => {
    async function loadEnrollment() {
      try {
        const { data } = await api.get(`/enrollments/${id}`);
        setEnrollment({
          startDate: parseISO(data.start_date),
          plan: data.plan,
          student: data.student
        });
      } catch (err) {
        toast.error('Matrícula não encontrada.');
        history.push('/matriculas');
      }
    }

    if (id) {
      loadEnrollment();
    }
  }, [id]);

  const endDate = useMemo(() => {
    if (!enrollment.plan || !enrollment.startDate) {
      return '';
    }

    return format(
      addMonths(enrollment.startDate, enrollment.plan.duration),
      'dd/MM/yyyy'
    );
  }, [enrollment.plan, enrollment.startDate]);

  const total = useMemo(() => {
    if (!enrollment.plan) {
      return 0;
    }

    return enrollment.plan.price * enrollment.plan.duration;
  }, [enrollment.plan]);

  async function handleSubmit(data) {
    if (id) {
      try {
        await api.put(`/enrollments/${id}`, {
          student_id: data.student.id,
          plan_id: data.plan.id,
          start_date: data.startDate
        });
        toast.success('Matricula alterada com sucesso!');
        history.push('/matriculas');
      } catch (err) {
        if (err.response && err.response.data) {
          toast.error(err.response.data.error);
        } else {
          toast.error(
            'Não foi possível atualizar matrícula, verifique seus dados'
          );
        }
      }
    } else {
      try {
        await api.post('/enrollments', {
          student_id: data.student.id,
          plan_id: data.plan.id,
          start_date: data.startDate
        });
        history.push('/matriculas');
        toast.success('Matrícula criada com sucesso!');
      } catch (err) {
        if (err.response && err.response.data) {
          toast.error(err.response.data.error);
        } else {
          toast.error(
            'Não foi possível criar nova matrícula, verifique seus dados'
          );
        }
      }
    }
  }

  return (
    <DefaultLayout>
      <Container>
        <Form initialData={enrollment} schema={schema} onSubmit={handleSubmit}>
          <Header>
            <h1>{id ? 'Edição de matrícula' : 'Cadastro de matrícula'}</h1>
            <Actions>
              <Button.routerLink
                to="/matriculas"
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
          {!loading ? (
            <Content>
              <Grid gutter="10px">
                <Col>
                  <label className="form-label" htmlFor="student">
                    ALUNO
                  </label>
                  <AsyncSelect
                    name="student"
                    loadOptions={studentPromise}
                    placeholder="Selecione o aluno"
                    noOptionsMessage={() => 'Nenhum aluno encontrado'}
                    getOptionLabel={option => option.name}
                    getOptionValue={option => option}
                    defaultOptions
                    onChange={value =>
                      setEnrollment({ ...enrollment, student: value })
                    }
                    value={enrollment.student}
                  />
                </Col>
              </Grid>
              <Grid gutter="10px">
                <Col size="25%">
                  <label className="form-label" htmlFor="plan">
                    PLANO
                  </label>
                  <AsyncSelect
                    name="plan"
                    loadOptions={plansPromise}
                    placeholder="Selecione o plano"
                    noOptionsMessage={() => 'Nenhum plano encontrado'}
                    getOptionLabel={option => option.title}
                    getOptionValue={option => option}
                    onChange={value =>
                      setEnrollment({ ...enrollment, plan: value })
                    }
                    defaultOptions
                    value={enrollment.plan}
                  />
                </Col>
                <Col size="25%">
                  <label className="form-label" htmlFor="startDate">
                    DATA DE INÍCIO
                  </label>
                  <Datepicker
                    name="startDate"
                    className="form-control"
                    dateFormat="dd/MM/yyyy"
                    onChange={value => {
                      setEnrollment({ ...enrollment, startDate: value });
                    }}
                    selected={enrollment.startDate}
                  />
                </Col>
                <Col size="25%">
                  <label className="form-label" htmlFor="endDate">
                    DATA DE TÉRMINO
                  </label>
                  <Input
                    id="endDate"
                    name="endDate"
                    className="form-control"
                    value={endDate}
                    disabled
                  />
                </Col>
                <Col size="25%">
                  <label className="form-label" htmlFor="total">
                    VALOR FINAL
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
          ) : null}
        </Form>
      </Container>
    </DefaultLayout>
  );
}

EnrollmentForm.propTypes = {
  match: propTypes.shape({
    params: propTypes.shape({
      id: propTypes.string
    })
  })
};

EnrollmentForm.defaultProps = {
  match: propTypes.shape({
    params: propTypes.shape({
      id: null
    })
  })
};
