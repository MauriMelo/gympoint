import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import dbConfig from '../config/dbConfig';
import User from '../app/models/User';
import Student from '../app/models/Student';
import Plan from '../app/models/Plan';
import Enrollment from '../app/models/Enrollment';
import HelpOrder from '../app/models/HelpOrder';
import mongoConfig from '../config/mongo';

const models = [User, Student, Plan, Enrollment, HelpOrder];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(dbConfig);
    models.forEach(model => {
      model.init(this.connection);
    });
    models.forEach(model => {
      if (model.associate) {
        model.associate(this.connection.models);
      }
    });
  }

  mongo() {
    this.mongooseConnection = mongoose.connect(
      mongoConfig.uri,
      mongoConfig.config
    );
  }
}

export default new Database();
