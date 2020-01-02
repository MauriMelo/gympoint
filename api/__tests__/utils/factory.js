import faker from 'faker';
import { factory } from 'factory-girl';
import Student from '../../src/app/models/Student';
import Plan from '../../src/app/models/Plan';
import Enrollment from '../../src/app/models/Enrollment';
import HelpOrder from '../../src/app/models/HelpOrder';

factory.define('Student', Student, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  age: faker.random.number(100),
  weight: faker.random.number({
    min: 50,
    max: 100,
    precision: 2,
  }),
  height: faker.random.number({
    min: 1,
    max: 2,
    precision: 2,
  }),
});

factory.define('StartPlan', Plan, {
  title: 'Start',
  duration: 1,
  price: 129.0,
});

factory.define('GoldPlan', Plan, {
  title: 'Gold',
  duration: 3,
  price: 109.9,
});

factory.define('DiamondPlan', Plan, {
  title: 'Diamond',
  duration: 6,
  price: 89,
});

factory.define('HelpOrder', HelpOrder, {
  question: faker.lorem.sentence(15),
});

factory.define('Enrollment', Enrollment, {});

export default factory;
