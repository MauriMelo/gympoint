import React from 'react';
import { Switch } from 'react-router-dom';
import Auth from '~/pages/Auth';
import Students from '~/pages/Students';
import StudentsForm from '~/pages/Students/Form';
import Plans from '~/pages/Plans';
import PlansForm from '~/pages/Plans/Form';
import Enrollments from '~/pages/Enrollments';
import EnrollmentsForm from '~/pages/Enrollments/Form';
import HelpOrders from '~/pages/HelpOrders';
import Route from './Route';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Auth} />
      <Route path="/alunos" exact component={Students} isPrivate />
      <Route path="/alunos/cadastro" exact component={StudentsForm} isPrivate />
      <Route path="/alunos/:id" exact component={StudentsForm} isPrivate />
      <Route path="/planos" exact component={Plans} isPrivate />
      <Route path="/planos/cadastro" exact component={PlansForm} isPrivate />
      <Route path="/planos/:id" exact component={PlansForm} isPrivate />
      <Route path="/matriculas" exact component={Enrollments} isPrivate />
      <Route
        path="/matriculas/cadastro"
        exact
        component={EnrollmentsForm}
        isPrivate
      />
      <Route
        path="/matriculas/:id"
        exact
        component={EnrollmentsForm}
        isPrivate
      />
      <Route path="/auxilios" exact component={HelpOrders} isPrivate />
      <Route path="/" component={() => <h1>404</h1>} />
    </Switch>
  );
}
