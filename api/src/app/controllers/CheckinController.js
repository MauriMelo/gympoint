import { subDays } from 'date-fns';
import Checkin from '../schema/Checkin';

class CheckinController {
  async index(req, res) {
    const { id } = req.params;
    const { page = 1 } = req.query;
    const { docs: checkins, totalPages } = await Checkin.paginate(
      {
        student_id: parseInt(id, 10),
      },
      {
        page,
        limit: 10,
      }
    );
    return res.json({
      checkins,
      pagination: {
        page: parseInt(page, 10),
        pages: totalPages,
      },
    });
  }

  async store(req, res) {
    const { id } = req.params;
    const today = new Date();
    const checkins = await Checkin.find({
      student_id: parseInt(id, 10),
      createdAt: {
        $gte: subDays(today, 7),
        $lte: today,
      },
    });

    if (checkins.length >= 5) {
      return res.status(401).json({
        error: 'Você não pode realizar check-in mais que 5 vezes em uma semana',
      });
    }

    const checkin = await Checkin.create({
      student_id: parseInt(id, 10),
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
