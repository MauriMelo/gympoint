import styled from 'styled-components';

export const Col = styled.div`
  flex: 1 1 ${props => props.size || 'auto'};
`;

export const Grid = styled.div`
  display: flex;
  margin: 0 -${props => (props.gutter ? props.gutter : '15px')};
  ${Col} {
    padding: 0 ${props => props.gutter || '15px'};
  }
`;
