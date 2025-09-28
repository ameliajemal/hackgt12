// src/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f4f8;
`;

const Card = styled.div`
  background: white;
  padding: 3rem 4rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  text-align: center;
  width: 400px;
`;

const Title = styled.h2`
  color: #7ac77d;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  width: 100%;
  background-color: #7ac77d;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #63b465;
  }
`;

const Error = styled.p`
  color: red;
  margin-bottom: 1rem;
`;

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const accounts = JSON.parse(localStorage.getItem('accounts') || '{}');
    const storedPwd = accounts[username];

    if (!storedPwd) {
      setError('Username not found');
      return;
    }

    if (storedPwd !== password) {
      setError('Incorrect password');
      return;
    }

    // success!
    localStorage.setItem('therapist', username);
    navigate('/home');
  };

  return (
    <Container>
      <Card>
        <Title>Therapist Login</Title>

        {error && <Error>{error}</Error>}

        <form onSubmit={handleSubmit}>
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

          <Button type="submit">Login</Button>
        </form>
      </Card>
    </Container>
  );
}
