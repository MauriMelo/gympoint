import Sequelize, { Model } from 'sequelize';
import sequelizePaginate from 'sequelize-paginate';

class Student extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        age: Sequelize.INTEGER,
        weight: Sequelize.DECIMAL(10, 2),
        height: Sequelize.DECIMAL(10, 2),
      },
      {
        paranoid: true,
        sequelize,
      }
    );
    sequelizePaginate.paginate(this);
    return this;
  }

  static associate(models) {
    this.hasMany(models.Enrollment, {
      as: 'enrollments',
    });
  }
}

export default Student;
