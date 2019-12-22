import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Logo, Header, Name, Nav, Item, Profile } from './styles';
import { LinkButton } from '~/styles/Button';
import logo from '~/assets/logo.png';
import { signOut } from '~/store/modules/auth/actions';

export default function DefaultHeader() {
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.user);

  function handleLogOut() {
    dispatch(signOut());
  }

  return (
    <Header>
      <Container>
        <Logo to="/alunos">
          <img src={logo} alt="Gympoint" width="45" />
          <Name>GYMPOINT</Name>
        </Logo>
        <Nav>
          <Item to="/alunos" activeClassName="active">
            ALUNOS
          </Item>
          <Item to="/planos" activeClassName="active">
            PLANOS
          </Item>
          <Item to="/matriculas" activeClassName="active">
            MATRÍCULAS
          </Item>
          <Item to="/auxilios" activeClassName="active">
            {' '}
            PEDIDOS DE AUXÍLIO
          </Item>
        </Nav>
        {profile ? (
          <Profile>
            <span>{profile.name}</span>
            <LinkButton type="button" onClick={handleLogOut} primary>
              sair do sistema
            </LinkButton>
          </Profile>
        ) : null}
      </Container>
    </Header>
  );
}
