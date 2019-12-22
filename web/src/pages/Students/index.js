import React, { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { MdAdd, MdSearch } from 'react-icons/md';
import { toast } from 'react-toastify';
import DefaultLayout from '~/pages/_layouts/default';
import {
  Container,
  Header,
  Actions,
  Content,
  RemoveEnrollmentsConfirm
} from './styles';
import Pagination from '~/components/Pagination';
import { Button, LinkButton } from '~/styles/Button';
import { FormControlIcon } from '~/styles/Form';
import api from '~/services/api';
import { Loading } from '~/styles/Loading';

let searchTimeout = null;

export default function Students() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [removeEnrrolments, setRemoveEnrrolments] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });
  const [students, setStudents] = useState([]);

  async function loadStudents(searchValue, page) {
    setLoading(true);
    try {
      const { data } = await api.get('/students', {
        params: {
          q: searchValue || null,
          page
        }
      });
      setStudents(data.students);
      setPagination(data.pagination);
    } catch (error) {
      setStudents([]);
      setPagination({
        page: 1,
        pages: 1,
        total: 0
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    loadStudents();
  }, []);

  function handleSearch(e) {
    const { value } = e.target;
    setSearch(value);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setLoading(true);
    const timeout = setTimeout(async () => {
      loadStudents(value);
    }, 1000);
    searchTimeout = timeout;
  }

  function handlePrev(page) {
    loadStudents(search, page);
  }

  function handleNext(page) {
    loadStudents(search, page);
  }

  function handleRemove(id) {
    async function removeStudent() {
      try {
        await api.delete(`students/${id}`, {
          data: {
            remove_enrollments: removeEnrrolments
          }
        });
        toast.success('Aluno removido com sucesso');

        setStudents(students.filter(student => student.id !== id));
      } catch (err) {
        toast.error('Não foi possível remover aluno');
      }
    }

    function handleSetEnrrolment(e) {
      setRemoveEnrrolments(e.target.checked);
    }

    confirmAlert({
      title: 'Remover aluno',
      message: 'Tem certeza que deseja remover esse aluno?',
      childrenElement: () => (
        <RemoveEnrollmentsConfirm>
          <input
            type="checkbox"
            id="removeEnrollments"
            name="removeEnrollments"
            onChange={handleSetEnrrolment}
            checked
          />
          <label htmlFor="removeEnrollments">Remover matrículas do aluno</label>
        </RemoveEnrollmentsConfirm>
      ),
      buttons: [
        {
          label: 'Sim',
          onClick: () => removeStudent()
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
          <h1>Gerenciando alunos</h1>
          <Actions>
            <Button.routerLink to="/alunos/cadastro" size="small" icon="true">
              <MdAdd size={20} />
              CADASTRAR
            </Button.routerLink>
            <FormControlIcon>
              <MdSearch size={16} color="#999" />
              <input
                type="text"
                className="form-control form-control--small"
                placeholder="Buscar aluno"
                onChange={handleSearch}
                value={search}
              />
            </FormControlIcon>
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
                    <th align="left">NOME</th>
                    <th align="left">E-MAIL</th>
                    <th align="center">IDADE</th>
                    <th>&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length > 0 ? (
                    students.map(student => (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td align="center">{student.age}</td>
                        <td align="right">
                          <LinkButton.routerLinkButton
                            to={`/alunos/${student.id}`}
                          >
                            editar
                          </LinkButton.routerLinkButton>
                          <LinkButton
                            onClick={() => handleRemove(student.id)}
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
