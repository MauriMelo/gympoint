import { Router } from 'express';
import bodyParser from 'body-parser';
import SessionController from './app/controllers/SessionController';
import SessionStudentController from './app/controllers/SessionStudentController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import HelpOrderStudentController from './app/controllers/HelpOrderStudentController';
import AuthMiddleware from './app/middlewares/AuthMiddleware';

const routes = new Router();

routes.post(
  '/sessions',
  bodyParser.urlencoded({ extended: false }),
  SessionController.create
);

routes.post('/sessions/student', SessionStudentController.create);

// help orders
routes.get('/help-orders', AuthMiddleware, HelpOrderController.index);
routes.put(
  '/help-orders/:id/answer',
  AuthMiddleware,
  HelpOrderController.update
);

// students
routes.get('/students', AuthMiddleware, StudentController.index);
routes.post('/students', AuthMiddleware, StudentController.create);
routes.get('/students/:id', AuthMiddleware, StudentController.show);
routes.put('/students/:id', AuthMiddleware, StudentController.update);
routes.delete('/students/:id', AuthMiddleware, StudentController.delete);

// help orders student
routes.get('/students/:id/help-orders', HelpOrderStudentController.index);
routes.post('/students/:id/help-orders', HelpOrderStudentController.create);

// checkins
routes.get('/students/:id/checkins', CheckinController.index);
routes.post('/students/:id/checkins', CheckinController.store);

// plans
routes.get('/plans', AuthMiddleware, PlanController.index);
routes.post('/plans', AuthMiddleware, PlanController.store);
routes.put('/plans/:id', AuthMiddleware, PlanController.update);
routes.get('/plans/:id', AuthMiddleware, PlanController.show);
routes.delete('/plans/:id', AuthMiddleware, PlanController.delete);

// matricula
routes.get('/enrollments', AuthMiddleware, EnrollmentController.index);
routes.post('/enrollments', AuthMiddleware, EnrollmentController.store);
routes.put('/enrollments/:id', AuthMiddleware, EnrollmentController.update);
routes.delete('/enrollments/:id', AuthMiddleware, EnrollmentController.delete);
routes.get('/enrollments/:id', AuthMiddleware, EnrollmentController.show);

export default routes;
