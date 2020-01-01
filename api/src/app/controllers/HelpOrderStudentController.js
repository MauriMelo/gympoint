import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';

class HelpOrderStudentController {
  async index(req, res) {
    const { id } = req.params;
    const { page = 1 } = req.query;
    const { docs: orders, pages, total } = await HelpOrder.paginate({
      where: {
        student_id: id,
      },
      page,
      paginate: 10,
      attributes: ['id', 'question', 'answer', 'answer_at', 'created_at'],
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

  async create(req, res) {
    const { id } = req.params;
    const { question } = req.body;

    const schema = Yup.object().shape({
      question: Yup.string()
        .trim()
        .required(),
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

    const order = await HelpOrder.create({
      student_id: parseInt(id, 10),
      question,
    });

    return res.json(order);
  }
}

export default new HelpOrderStudentController();
