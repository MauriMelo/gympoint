import * as Yup from 'yup';
import { Op } from 'sequelize';
import Student from '../models/Student';
import Enrollment from '../models/Enrollment';

class StudentController {
  async index(req, res) {
    const { q = '', page = 1 } = req.query;
    const { docs: students, pages, total } = await Student.paginate({
      page,
      paginate: 10,
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${q}%`,
            },
          },
          {
            email: {
              [Op.like]: `%${q}%`,
            },
          },
        ],
      },
    });

    if (students.length === 0) {
      return res.status(404).json({
        error: 'Nenhum estudante foi encontrado',
      });
    }

    return res.json({
      students,
      pagination: {
        page: parseInt(page, 10),
        pages,
        total,
      },
    });
  }

  async show(req, res) {
    const { id } = req.params;
    const student = await Student.findOne({
      where: {
        id,
      },
    });

    if (!student) {
      return res.status(404).json({
        error: 'Estudante não encontrado',
      });
    }

    return res.json(student);
  }

  async create(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().nullable(),
      weight: Yup.number().nullable(),
      height: Yup.number().nullable(),
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

    const findEmail = await Student.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (findEmail) {
      return res.status(401).json({
        error: 'Este e-mail já está em uso.',
      });
    }

    const student = await Student.create(req.body);

    return res.json(student);
  }

  async update(req, res) {
    const { id = 0 } = req.params;

    const schema = Yup.object().shape({
      name: Yup.string().nullable(),
      email: Yup.string()
        .email()
        .nullable(),
      age: Yup.number().nullable(),
      weight: Yup.number().nullable(),
      height: Yup.number().nullable(),
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

    const student = await Student.findOne({
      where: {
        id,
      },
    });
    const { name, age, email, weight, height } = req.body;

    if (!student) {
      return res.status(404).json({
        error: 'Estudante não encontrado',
      });
    }

    if (email && email !== student.email) {
      const findEmail = await Student.findOne({
        where: {
          email,
        },
      });

      if (findEmail) {
        return res.status(401).json({
          error: 'Este e-mail já está em uso.',
        });
      }
    }

    await student.update({
      name,
      email,
      age,
      weight,
      height,
    });

    return res.json(student);
  }

  async delete(req, res) {
    const { id } = req.params;
    const { remove_enrollments } = req.body;

    const student = await Student.findOne({
      where: {
        id,
      },
      include: [
        {
          association: 'enrollments',
          attributes: ['id'],
        },
      ],
    });

    if (!student) {
      return res.status(404).json({
        error: 'Estudante não encontrado',
      });
    }

    if (student.enrollments.length > 0 && remove_enrollments) {
      Enrollment.destroy({
        where: {
          student_id: id,
        },
      });
    }

    await student.destroy();

    return res.status(200).json(true);
  }
}

export default new StudentController();
