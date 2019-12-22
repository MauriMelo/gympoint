import React, { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { MdAdd, MdCheckCircle } from 'react-icons/md';
import { toast } from 'react-toastify';
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import DefaultLayout from '~/pages/_layouts/default';
import { Container, Header, Actions, Content } from './styles';
import Pagination from '~/components/Pagination';
import { Button, LinkButton } from '~/styles/Button';
import api from '~/services/api';
import { Loading } from '~/styles/Loading';

export default function Enrollments() {
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });
  const [enrollments, setEnrollments] = useState([]);

  async function loadEnrollments(page) {
    setLoading(true);
    try {
      const { data } = await api.get('/enrollments', {
        params: {
          page
        }
      });
      setEnrollments(data.enrollments);
      setPagination(data.pagination);
    } catch (error) {
      setEnrollments([]);
      setPagination({
        page: 1,
        pages: 1,
        total: 0
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    loadEnrollments();
  }, []);

  function handlePrev(page) {
    loadEnrollments(page);
  }

  function handleNext(page) {
    loadEnrollments(page);
  }

  function handleRemove(id) {
    async function removeEnrollment() {
      try {
        await api.delete(`enrollments/${id}`);
        toast.success('Matrícula removida com sucesso');

        setEnrollments(enrollments.filter(enrollment => enrollment.id !== id));
      } catch (err) {
        toast.error('Não foi possível remover matrícula');
      }
    }

    confirmAlert({
      title: 'Remover matrícula',
      message: 'Tem certeza que deseja remover essa matrícula?',
      buttons: [
        {
          label: 'Sim',
          onClick: () => removeEnrollment()
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
          <h1>Gerenciando matrículas</h1>
          <Actions>
            <Button.routerLink
              to="/matriculas/cadastro"
              size="small"
              icon="true"
            >
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
                    <th width="25%" align="left">
                      ALUNO
                    </th>
                    <th width="20%" align="center">
                      PLANO
                    </th>
                    <th align="center">INÍCIO</th>
                    <th align="center">TÉRMINO</th>
                    <th align="center">ATIVA</th>
                    <th>&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.length > 0 ? (
                    enrollments.map(enrollment => (
                      <tr key={enrollment.id}>
                        <td>{enrollment.student.name}</td>
                        <td align="center">{enrollment.plan.title}</td>
                        <td align="center">
                          {format(
                            parseISO(enrollment.start_date),
                            "dd 'de' MMMM 'de' yyyy ",
                            { locale: pt }
                          )}
                        </td>
                        <td align="center">
                          {format(
                            parseISO(enrollment.end_date),
                            "dd 'de' MMMM 'de' yyyy ",
                            { locale: pt }
                          )}
                        </td>
                        <td align="center">
                          <MdCheckCircle
                            size={20}
                            color={enrollment.active ? '#42cb59' : '#ddd'}
                          />
                        </td>
                        <td align="center">
                          <LinkButton.routerLinkButton
                            to={`/matriculas/${enrollment.id}`}
                          >
                            editar
                          </LinkButton.routerLinkButton>
                          <LinkButton
                            onClick={() => handleRemove(enrollment.id)}
                            primary
                          >
                            apagar
                          </LinkButton>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" align="center">
                        Nenhum registro encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="text-right">
                <Pagination
                  page={pagination.page}
                  pages={pagination.pages}
                  total={pagination.total}
                  handleNext={handleNext}
                  handlePrev={handlePrev}
                />
              </div>
            </>
          )}
        </Content>
      </Container>
    </DefaultLayout>
  );
}
