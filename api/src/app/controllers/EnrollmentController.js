import * as Yup from 'yup';
import { isBefore, parseISO, addMonths, format, startOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Plan from '../models/Plan';
import Student from '../models/Student';
import Enrollment from '../models/Enrollment';
import EnrollmentMail from '../jobs/EnrollmentMail';
import Queue from '../../lib/Queue';

class EnrollmentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const { docs: enrollments, pages, total } = await Enrollment.paginate({
      page,
      paginate: 10,
      attributes: ['id', 'start_date', 'end_date', 'price', 'active'],
      include: [
        {
          association: 'student',
          paranoid: false,
          attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
        },
        {
          association: 'plan',
          paranoid: false,
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    if (!enrollments) {
      return res.status(404).json({
        error: 'Matrícula não encontrada',
      });
    }

    return res.json({
      enrollments,
      pagination: {
        page: parseInt(page, 10),
        pages,
        total,
      },
    });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number().required(),
      student_id: Yup.number().required(),
      start_date: Yup.date().required(),
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

    const { plan_id, student_id, start_date } = req.body;
    const start_date_iso = parseISO(start_date);
    if (isBefore(start_date_iso, startOfDay(new Date()))) {
      return res.status(401).json({
        error: 'Apenas datas futuras são permitidas',
      });
    }

    const plan = await Plan.findOne({
      where: {
        id: plan_id,
      },
    });

    if (!plan) {
      return res.status(400).json({
        error: 'Plano não encontrado.',
      });
    }

    const student = await Student.findOne({
      where: {
        id: student_id,
      },
    });

    if (!student) {
      return res.status(400).json({
        error: 'Estudante não encontrado.',
      });
    }

    const findEnrollment = await Enrollment.findOne({
      where: {
        plan_id,
        student_id,
      },
    });

    if (findEnrollment) {
      return res.status(401).json({
        error: 'Este aluno já está matrículado neste plano',
      });
    }

    const end_date = addMonths(start_date_iso, plan.duration);
    const price = plan.price * plan.duration;
    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date: start_date_iso,
      end_date,
      price,
    });

    Queue.add(EnrollmentMail.key, {
      to: `${student.name} <${student.email}>`,
      subject: 'Nova matrícula realizada',
      plan: plan.title,
      start_date: format(start_date_iso, 'dd/MM/yyyy'),
      end_date: format(end_date, 'dd/MM/yyyy'),
      price: price.toLocaleString(),
    });

    return res.status(201).json(enrollment);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number().required(),
      student_id: Yup.number().required(),
      start_date: Yup.date().required(),
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

    const { plan_id, student_id, start_date } = req.body;
    const { id } = req.params;

    const enrollment = await Enrollment.findOne({
      where: {
        id,
      },
    });

    if (!enrollment) {
      return res.status(404).json({
        error: 'Matrícula não encontrada.',
      });
    }

    const start_date_iso = parseISO(start_date);
    const plan = await Plan.findOne({
      where: {
        id: plan_id,
      },
    });

    if (!plan) {
      return res.status(400).json({
        error: 'Plano não encontrado.',
      });
    }

    const student = await Student.findOne({
      id: student_id,
    });

    if (!student) {
      return res.status(400).json({
        error: 'Estudante não encontrado.',
      });
    }
    const findEnrollment = await Enrollment.findOne({
      where: {
        plan_id,
        student_id,
        id: {
          [Op.not]: id,
        },
      },
    });

    if (findEnrollment) {
      return res.status(401).json({
        error: 'Aluno já está matrículado no plano selecionado',
      });
    }

    const end_date = addMonths(start_date_iso, plan.duration);
    const price = plan.price * plan.duration;

    await enrollment.update({
      student_id,
      plan_id,
      start_date: start_date_iso,
      end_date,
      price,
    });

    Queue.add(EnrollmentMail.key, {
      to: `${student.name} <${student.email}>`,
      subject: 'Matrícula atualizada',
      plan: plan.title,
      start_date: format(start_date_iso, 'dd/MM/yyyy'),
      end_date: format(end_date, 'dd/MM/yyyy'),
      price: price.toLocaleString(),
    });

    return res.status(200).json(enrollment);
  }

  async show(req, res) {
    const { id } = req.params;

    const enrollment = await Enrollment.findOne({
      where: {
        id,
      },
      attributes: ['id', 'start_date', 'end_date', 'price', 'active'],
      include: [
        {
          association: 'student',
          attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
        },
        {
          association: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    if (!enrollment) {
      return res.status(404).json({
        error: 'Matrícula não encontrada.',
      });
    }

    return res.status(200).json(enrollment);
  }

  async delete(req, res) {
    const { id } = req.params;

    const enrollment = await Enrollment.findOne({
      where: {
        id,
      },
    });

    if (!enrollment) {
      return res.status(404).json({
        error: 'Matrícula não encontrada.',
      });
    }

    await enrollment.destroy();

    return res.status(200).json(true);
  }
}

export default new EnrollmentController();
