import styled from 'styled-components';
import { Button } from '../reusable/button';

export const Form = styled.form`
  margin-top: ${({ theme }) => theme.spacing(6.25)};
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing(1.25)};
  
  .block__margin {
    margin-bottom: ${({ theme }) => theme.spacing(5)};
  }
`;

export const ButtonSec = styled(Button)`
  margin-right: ${({ theme }) => theme.spacing(4)};
`;
export const SubmitButton = styled(Button)`
  margin-right: ${({ theme }) => theme.spacing(4)};
`;
export const P = styled.p`
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;
