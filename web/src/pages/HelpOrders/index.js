import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaCircleNotch } from 'react-icons/fa';
import { Form, Textarea } from '@rocketseat/unform';
import { keyframes } from 'styled-components';
import { fadeInDown, fadeOutUp } from 'react-animations';
import * as Yup from 'yup';
import Pagination from '~/components/Pagination';
import DefaultLayout from '~/pages/_layouts/default';
import {
  Container,
  Header,
  Content,
  List,
  Item,
  Reply,
  Title,
  TextNotFound
} from './styles';
import api from '~/services/api';
import { LinkButton, Button } from '~/styles/Button';
import Modal from '~/components/Modal';

const animationIn = keyframes`${fadeInDown}`;
const animationOut = keyframes`${fadeOutUp}`;

export default function Plans() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeOrder, setActiveOrder] = useState();
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });
  const [open, setOpen] = useState(false);

  const schema = Yup.object().shape({
    answer: Yup.string().required('Campo obrigatório')
  });

  async function loadHelpOrders(page) {
    try {
      const { data } = await api.get('/help-orders', {
        params: {
          page
        }
      });
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (error) {
      setOrders([]);
      setPagination({
        page: 1,
        pages: 1,
        total: 0
      });
    }
  }

  useEffect(() => {
    loadHelpOrders();
  }, []);

  function handleReply(order) {
    setActiveOrder(order);
    setOpen(true);
  }

  function handleCloseModal() {
    setOpen(false);
  }

  async function handleSubmit(data, { resetForm }) {
    setLoading(true);
    try {
      await api.put(`/help-orders/${activeOrder.id}/answer`, {
        answer: data.answer
      });
      toast.success('Resposta criada com sucesso');
      setOpen(false);
      setOrders(orders.filter(order => order.id !== activeOrder.id));
    } catch (err) {
      if (err.response && err.response.data) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Não foi possível responder aluno');
      }
    }

    setLoading(false);
    resetForm();
  }

  function handlePrev(page) {
    loadHelpOrders(page);
  }

  function handleNext(page) {
    loadHelpOrders(page);
  }

  return (
    <>
      <DefaultLayout>
        <Container>
          <Header>
            <h1>Pedidos de auxílio</h1>
          </Header>
          <Content>
            <h3>ALUNO</h3>
            {orders.length > 0 ? (
              <List>
                {orders.map(order => (
                  <Item key={order.id}>
                    {order.student.name}
                    <LinkButton onClick={() => handleReply(order)}>
                      responder
                    </LinkButton>
                  </Item>
                ))}
              </List>
            ) : (
              <TextNotFound>
                Nenhum pedido de auxílio até o momento.
              </TextNotFound>
            )}
            <div className="text-right">
              <Pagination
                page={pagination.page}
                pages={pagination.pages}
                total={pagination.total}
                handleNext={handleNext}
                handlePrev={handlePrev}
              />
            </div>
          </Content>
        </Container>
      </DefaultLayout>
      <Modal
        isOpen={open}
        onRequestClose={handleCloseModal}
        ariaHideApp={false}
        animationIn={animationIn}
        animationOut={animationOut}
      >
        {activeOrder ? (
          <Form schema={schema} onSubmit={handleSubmit}>
            <Reply>
              <Title>PERGUNTA DO ALUNO</Title>
              <span>{activeOrder.question}</span>
              <label htmlFor="answer" className="form-label">
                SUA RESPOSTA
              </label>
              <Textarea name="answer" className="form-control" />
              <Button loading={loading ? 1 : 0}>
                {loading ? <FaCircleNotch /> : 'Responder aluno'}
              </Button>
            </Reply>
          </Form>
        ) : null}
      </Modal>
    </>
  );
}
