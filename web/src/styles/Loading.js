import styled, { keyframes } from 'styled-components';
import { FaCircleNotch } from 'react-icons/fa';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
`;

export const Loading = styled(FaCircleNotch)`
  animation: ${spin} 2s infinite linear;
`;
