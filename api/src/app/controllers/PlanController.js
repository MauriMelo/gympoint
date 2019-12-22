import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
    });
    return res.json({
      plans,
    });
  }

  async show(req, res) {
    const { id } = req.params;

    const plan = await Plan.findOne({
      where: {
        id,
      },
    });

    if (!plan) {
      return res.status(404).json({
        error: 'Plano não encontrado.',
      });
    }

    return res.json(plan);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
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

    const plan = await Plan.create(req.body);
    return res.json(plan);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
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

    const { id } = req.params;

    const plan = await Plan.findOne({
      where: {
        id,
      },
    });

    if (!plan) {
      return res.status(404).json({
        error: 'Plano não encontrado.',
      });
    }

    const { title, price, duration } = req.body;

    plan.update({
      title,
      price,
      duration,
    });

    return res.json(plan);
  }

  async delete(req, res) {
    const { id } = req.params;

    const plan = await Plan.findOne({
      where: {
        id,
      },
    });

    if (!plan) {
      return res.status(404).json({
        error: 'Plano não encontrado.',
      });
    }

    await plan.destroy();

    return res.status(200).json(plan);
  }
}

export default new PlanController();
