import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { LinkButton } from '~/styles/Button';
import colors from '~/styles/colors';

export const Header = styled.div`
  background: white;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  max-width: 1366px;
  margin: 0 auto;
  padding: 0 15px;
`;

export const Logo = styled(NavLink)`
  display: flex;
  align-items: center;
  img {
    margin-right: 15px;
  }
`;

export const Name = styled.div`
  font-weight: bold;
  color: ${colors.primary};
  font-size: 15px;
`;
export const Nav = styled.nav`
  display: flex;
  margin-left: 20px;
  border-left: 1px solid #ddd;
  padding: 10px 0 10px 20px;
`;
export const Item = styled(NavLink)`
  font-weight: bold;
  margin-right: 15px;
  font-size: 15px;
  transition: 0.5s color;
  color: #999;

  &.active {
    color: #444;
  }
`;
export const Profile = styled.div`
  margin-left: auto;
  font-size: 14px;
  text-align: right;
  > span {
    color: #666;
    font-weight: bold;
  }
  ${LinkButton} {
    display: block;
    margin-top: 3px;
  }
`;
