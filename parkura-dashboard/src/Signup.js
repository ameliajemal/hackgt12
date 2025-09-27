import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem 5%;
`;

const Title = styled.h2`
  color: #7ac77d;
  margin-bottom: 1rem;
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  flex: 1 1 200px;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #7ac77d;
  color: white;
  font-weight: 600;
  border-radius: 6px;
  transition: 0.3s;

  &:hover {
    background-color: #63b465;
  }
`;

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    const accounts = JSON.parse(localStorage.getItem('accounts') || '{}');
    if (accounts[username]) {
      alert('Username already exists!');
      return;
    }
    accounts[username] = password;
    localStorage.setItem('accounts', JSON.stringify(accounts));
    alert('Account created!');
    navigate('/');
  };

  return (
    <Container>
      <Title>Create Therapist Account</Title>
      <Form onSubmit={handleSignup}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Sign Up</Button>
      </Form>
    </Container>
  );
}
