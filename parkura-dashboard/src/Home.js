// src/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem 5%;
`;

const Header = styled.h1`
  color: #7ac77d;
  font-size: 2.5rem;
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.15);
  }
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 1rem;
`;

export default function Home() {
  const patients = [
    { id: 1, name: 'Alice Smith' },
    { id: 2, name: 'Bob Johnson' },
    { id: 3, name: 'Charlie Lee' },
  ];

  return (
    <Container>
      <Header>Patient Dashboard</Header>
      <Grid>
        {patients.map(p => (
          <Link key={p.id} to={`/patient/${p.id}`} style={{ textDecoration: 'none' }}>
            <Card>
              <Avatar src={`https://i.pravatar.cc/150?img=${p.id}`} alt={p.name} />
              <h3 style={{ color: '#333' }}>{p.name}</h3>
            </Card>
          </Link>
        ))}
      </Grid>
    </Container>
  );
}
