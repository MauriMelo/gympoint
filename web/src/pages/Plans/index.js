import React, { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { MdAdd } from 'react-icons/md';
import { toast } from 'react-toastify';
import DefaultLayout from '~/pages/_layouts/default';
import { Container, Header, Actions, Content } from './styles';
import { Button, LinkButton } from '~/styles/Button';
import api from '~/services/api';
import { Loading } from '~/styles/Loading';

export default function Plans() {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);

  async function loadPlans(page) {
    setLoading(true);
    try {
      const { data } = await api.get('/plans', {
        params: {
          page
        }
      });
      setPlans(data.plans);
    } catch (error) {
      setPlans([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadPlans();
  }, []);

  function handleRemove(id) {
    async function removePlan() {
      try {
        await api.delete(`plans/${id}`);
        toast.success('Plano removido com sucesso');

        setPlans(plans.filter(plan => plan.id !== id));
      } catch (err) {
        toast.error('Não foi possível remover plano');
      }
    }

    confirmAlert({
      title: 'Remover plano',
      message: 'Tem certeza que deseja remover esse plano?',
      buttons: [
        {
          label: 'Sim',
          onClick: () => removePlan()
        },
        {
          label: 'Não'
        }
      ],
      closeOnEscape: true,
      closeOnClickOutside: true
    });
  }

  return (
    <DefaultLayout>
      <Container>
        <Header>
          <h1>Gerenciando planos</h1>
          <Actions>
            <Button.routerLink to="/planos/cadastro" size="small" icon="true">
              <MdAdd size={20} />
              CADASTRAR
            </Button.routerLink>
          </Actions>
        </Header>
        <Content>
          {loading ? (
            <center>
              <Loading color="#444" />
            </center>
          ) : (
            <>
              <table className="table" width="100%">
                <thead>
                  <tr>
                    <th width="45%" align="left">
                      TÍTULO
                    </th>
                    <th align="center">DURAÇÃO</th>
                    <th align="center">VALOR p/ MÊS</th>
                    <th>&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.length > 0 ? (
                    plans.map(plan => (
                      <tr key={plan.id}>
                        <td>{plan.title}</td>
                        <td align="center">{plan.duration} mês</td>
                        <td align="center">
                          R${' '}
                          {plan.price.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2
                          })}
                        </td>
                        <td align="right">
                          <LinkButton.routerLinkButton
                            to={`/planos/${plan.id}`}
                          >
                            editar
                          </LinkButton.routerLinkButton>
                          <LinkButton
                            onClick={() => handleRemove(plan.id)}
                            primary
                          >
                            apagar
                          </LinkButton>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" align="center">
                        Nenhum registro encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </Content>
      </Container>
    </DefaultLayout>
  );
}
