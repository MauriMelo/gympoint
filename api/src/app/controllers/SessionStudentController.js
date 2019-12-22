import Student from '../models/Student';

class SessionStudentController {
  async create(req, res) {
    const { id } = req.body;

    const student = await Student.findByPk(id, {
      attributes: ['id', 'name', 'email'],
      include: [
        {
          association: 'enrollments',
          attributes: ['id', 'start_date', 'end_date', 'active'],
        },
      ],
    });

    if (!student) {
      return res.status(401).json({
        error: 'Estudante não encontrado.',
      });
    }

    const enrollmentActive = student.enrollments.find(enrollment => {
      return enrollment.active;
    });

    if (!enrollmentActive) {
      return res.status(401).json({
        error: 'Sua matrícula não está ativa',
      });
    }

    return res.json({
      student,
    });
  }
}

export default new SessionStudentController();
