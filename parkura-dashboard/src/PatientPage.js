// src/PatientPage.js
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Container = styled.div`
  padding: 2rem 5%;
  min-height: 100vh;
  background: #f0f7f0;
`;

const ProfileCard = styled.div`
  display: flex;
  align-items: center;
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-right: 2rem;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.h2`
  color: #7ac77d;
`;

const ChartWrapper = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
`;

export default function PatientPage() {
  const { id } = useParams();

  const mockData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
    datasets: [
      { label: 'Arm Movement (cm)', data: [30, 35, 33, 37, 40], borderColor: '#7ac77d', fill: false },
      { label: 'Leg Step Height (cm)', data: [10, 12, 11, 14, 15], borderColor: '#5fa45a', fill: false },
    ],
  };

  return (
    <Container>
      <ProfileCard>
        <Avatar src={`https://i.pravatar.cc/150?img=${id}`} alt={`Patient ${id}`} />
        <Info>
          <Name>Patient {id}</Name>
          <p>Age: 68</p>
          <p>Diagnosis: Parkinson’s Disease</p>
        </Info>
      </ProfileCard>

      <ChartWrapper>
        <h3>Mobility Data</h3>
        <Line data={mockData} />
      </ChartWrapper>
    </Container>
  );
}

