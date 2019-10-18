import styled from 'styled-components';

const Paragraph = styled.p`
  color: red;
`;

const Header = () => (
  <div>
    <Paragraph>This is the header.</Paragraph>
  </div>
);

export default Header;