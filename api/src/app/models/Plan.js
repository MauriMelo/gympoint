import Sequelize, { Model } from 'sequelize';
import sequelizePaginate from 'sequelize-paginate';

class Plan extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        duration: Sequelize.INTEGER,
        price: Sequelize.DECIMAL,
      },
      {
        paranoid: true,
        sequelize,
      }
    );

    sequelizePaginate.paginate(this);
    return this;
  }
}

export default Plan;
