import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async create(req, res) {
    const { email, password } = req.body;

    if (!req.is('application/x-www-form-urlencoded')) {
      return res.status(400).json({
        error: 'Content-Type inválido.',
      });
    }

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email e password inválido',
      });
    }

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user || !(await user.checkPassoword(password))) {
      return res.status(401).json({
        error: 'Não autorizado',
      });
    }

    const { id, name } = user;
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    return res.json({
      token,
      user: {
        email,
        name,
      },
    });
  }
}

export default new SessionController();
