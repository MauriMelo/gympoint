import * as Yup from 'yup';
import { format } from 'date-fns';
import HelpOrder from '../models/HelpOrder';
import OrderAnswerMail from '../jobs/OrderAnswerMail';
import Queue from '../../lib/Queue';

class HelpOrderController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const { docs: orders, pages, total } = await HelpOrder.paginate({
      page,
      paginate: 10,
      where: {
        answer_at: null,
      },
      attributes: ['id', 'question', 'answer', 'answer_at'],
      include: [
        {
          paranoid: false,
          association: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.json({
      orders,
      pagination: {
        page: parseInt(page, 10),
        pages,
        total,
      },
    });
  }

  async update(req, res) {
    const { id } = req.params;
    const { answer } = req.body;

    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    const validate = await schema
      .validate(req.body)
      .then(() => ({
        isValid: true,
      }))
      .catch(err => ({
        isValid: false,
        error: err.message,
      }));

    if (!validate.isValid) {
      return res.status(400).json({
        error: validate.error,
      });
    }

    const order = await HelpOrder.findByPk(id, {
      attributes: ['id', 'question', 'answer', 'answer_at'],
      include: [
        {
          paranoid: false,
          association: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        error: 'Auxílio não encontrado.',
      });
    }

    if (order.answer_at) {
      return res.status(401).json({
        error: 'Este auxílio já foi respondido',
      });
    }

    order.answer_at = new Date();
    order.answer = answer;
    await order.save();

    Queue.add(OrderAnswerMail.key, {
      to: `${order.student.name} <${order.student.email}>`,
      subject: 'Sua pergunta foi respondida',
      question: order.question,
      answer: order.answer,
      answer_at: format(order.answer_at, 'dd/MM/yyyy'),
    });

    return res.json(order);
  }
}

export default new HelpOrderController();
