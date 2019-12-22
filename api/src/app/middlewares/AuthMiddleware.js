import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(' ')[1]
    : false;

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
    });
  }
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    res.userId = decoded.id;
    return next();
  } catch (error) {
    return res.status(401).json({
      error: 'Unauthorized',
    });
  }
};
