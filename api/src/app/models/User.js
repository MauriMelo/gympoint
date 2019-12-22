import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
      },
      {
        paranoid: true,
        sequelize,
      }
    );

    return this;
  }

  async checkPassoword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
