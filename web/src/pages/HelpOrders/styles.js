import styled from 'styled-components';
import { LinkButton, Button } from '~/styles/Button';

export const Container = styled.div`
  max-width: 800px;
  margin: 30px auto 0;
  padding: 0 15px;
`;
export const Actions = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;
export const Header = styled.div`
  display: flex;
  align-items: center;
`;

export const Content = styled.div`
  background: white;
  padding: 30px;
  border-radius: 5px;
  margin-top: 20px;
`;

export const List = styled.ul``;
export const Item = styled.li`
  display: flex;
  padding: 15px 0;
  font-size: 16px;
  color: #666;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: 0;
  }

  ${LinkButton} {
    margin-left: auto;
  }
`;

export const Reply = styled.div`
  padding: 15px;
  font-size: 16px;
  color: #666666;
  line-height: 1.5;
  > span {
    display: inline-block;
    margin-bottom: 20px;
  }
  textarea {
    height: 100px;
  }
  ${Button} {
    margin-top: 15px;
    width: 100%;
  }
`;
export const Title = styled.div`
  font-size: 14px;
  color: #444444;
  font-weight: bold;
  margin-bottom: 5px;
`;

export const TextNotFound = styled.div`
  margin: 15px 0;
  text-align: center;
  color: #989898;
`;
