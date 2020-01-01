import jwt from 'jsonwebtoken';
import authConfig from '../../src/config/auth';

export default function auth() {
  return jwt.sign({ id: 1 }, authConfig.secret, {
    expiresIn: authConfig.expiresIn,
  });
}
