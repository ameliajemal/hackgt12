// src/TopBar.js
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';

const Navbar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 5%;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
`;

// Clickable logo (for logged-out state)
const LogoLink = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #7ac77d;
  text-decoration: none;
`;

// Plain text logo (for logged-in state)
const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #7ac77d;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const NavItem = styled(Link)`
  color: #333;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    color: #7ac77d;
  }
`;

const NavButton = styled.button`
  background: none;
  border: none;
  font-weight: 500;
  color: #333;

  &:hover {
    color: #7ac77d;
  }
`;

export default function TopBar() {
  const navigate = useNavigate();
  const loggedIn = Boolean(localStorage.getItem('therapist'));

  const handleLogout = () => {
    localStorage.removeItem('therapist');
    navigate('/');
  };

  return (
    <Navbar>
      {loggedIn ? (
        <LogoText>Parkura</LogoText>
      ) : (
        <LogoLink to="/">Parkura</LogoLink>
      )}

      <NavLinks>
        {!loggedIn ? (
          <>
            <NavItem to="/about">About Us</NavItem>
            <NavItem to="/product">Our Product</NavItem>
          </>
        ) : (
          <>
            <NavItem to="/home">Dashboard</NavItem>
            <NavButton onClick={handleLogout}>Logout</NavButton>
          </>
        )}
      </NavLinks>
    </Navbar>
  );
}

