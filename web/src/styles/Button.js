import styled, { css } from 'styled-components';
import { darken } from 'polished';
import { Link } from 'react-router-dom';
import colors from './colors';

export const Button = styled.button.attrs(props => ({
  disabled: props.loading
}))`
  font-weight: bold;
  font-size: 16px;
  background: ${colors.primary};
  color: white;
  border: 0;
  border-radius: 5px;
  padding: 15px 18px;
  transition: 0.5s background;
  opacity: ${props => (props.loading ? 0.5 : 1)};

  &:hover {
    background: ${darken(0.04, colors.primary)};
  }

  ${props =>
    props.secondary &&
    css`
      background: ${colors.secondary};
      color: white;
      &:hover {
        background: ${darken(0.04, colors.secondary)};
      }
    `}

  @keyframes fa-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(359deg);
    }
  }

  ${props =>
    props.loading &&
    css`
      > svg {
        animation: fa-spin 2s infinite linear;
      }
    `}

  ${props =>
    props.size === 'small' &&
    css`
      font-size: 14px;
      padding: 8px 14px;
    `}

  ${props =>
    props.icon &&
    css`
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        margin-right: 5px;
      }
    `}
`;

Button.a = Button.withComponent('a');
Button.routerLink = Button.withComponent(Link);

export const LinkButton = styled.button`
  color: ${props => (props.primary ? colors.primary : '#4d85ee')};
  transition: 0.5s color;
  background: transparent;
  border: 0;
  font-size: 14px;
  &:hover {
    color: ${props => darken(0.03, props.primary ? colors.primary : '#4d85ee')};
    text-decoration: underline;
  }

  & + button,
  & + a {
    margin-left: 20px;
  }
`;

LinkButton.routerLinkButton = LinkButton.withComponent(Link);
