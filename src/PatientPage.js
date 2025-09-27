// src/PatientPage.js
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title as ChartTitle,
  Tooltip,
  Legend
} from "chart.js";

// avatar imports
import AmeliaImg  from "./avatars/Amelia_Jemal.png";
import AdeleImg   from "./avatars/Adele_Shen.png";
import AlexImg    from "./avatars/Alex_Zou.png";
import DefaultImg from "./avatars/default.png";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  ChartTitle,
  Tooltip,
  Legend
);

const AVATARS = {
  AmeliaJemal: AmeliaImg,
  AdeleShen:   AdeleImg,
  AlexZou:     AlexImg,
  default:     DefaultImg
};

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
  object-fit: cover;
  border: 3px solid #7ac77d;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.h2`
  color: #7ac77d;
  margin-bottom: 0.5rem;
`;

const Stat = styled.p`
  margin: 0.25rem 0;
  color: #333;
`;

const SectionTitle = styled.h3`
  margin: 2rem 0 1rem;
  color: #333;
`;

const GameButton = styled.button`
  margin-right: 1rem;
  margin-bottom: 1rem;
  padding: 0.6rem 1.2rem;
  background-color: #7ac77d;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
  &:hover { background-color: #63b465; }
`;

const SessionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const SessionButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${p => (p.active ? "#7ac77d" : "white")};
  color: ${p => (p.active ? "white" : "#7ac77d")};
  border: 1px solid #7ac77d;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
  &:hover { background-color: #63b465; color: white; }
`;

const ChartWrapper = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

export default function PatientPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const profile = state?.patientData || {};
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  const avatarSrc = AVATARS[id] || AVATARS.default;

  // SAMPLE APPLES DATA
  const appleSessions = [
    {
      id: "2025-09-27_14-24-17",
      VelocityDataLabels: [1,2,3,4,5,6],
      VelocityData:       [0.5,0.7,0.6,0.8,0.7,0.9],
      ShakeDataLabels:    [1,2,3,4,5,6],
      ShakeData:          [0.3,0.4,0.5,0.6,0.5,0.4],
      ApplesPicked:       28,
      TotalApples:        30
    },
    {
      id: "2025-09-26_11-12-10",
      VelocityDataLabels: [1,2,3,4,5,6],
      VelocityData:       [0.6,0.8,0.7,0.9,0.85,0.95],
      ShakeDataLabels:    [1,2,3,4,5,6],
      ShakeData:          [0.4,0.5,0.45,0.55,0.5,0.6],
      ApplesPicked:       25,
      TotalApples:        30
    }
  ];

  // chart builders
  const makeVelocityChart = s => ({
    labels: s.VelocityDataLabels,
    datasets: [
      {
        label: "Hand Velocity (m/s)",
        data: s.VelocityData,
        borderColor: "#7ac77d",
        backgroundColor: "#7ac77d",
        tension: 0.3
      }
    ]
  });

  const makeShakeChart = s => ({
    labels: s.ShakeDataLabels,
    datasets: [
      {
        label: "Angular Velocity (rad/s)",
        data: s.ShakeData,
        backgroundColor: s.ShakeData.map(v => (v > 0.5 ? "#e76f51" : "#7ac77d"))
      }
    ]
  });

  const makePieChart = s => {
    const p = s.ApplesPicked, t = s.TotalApples;
    return {
      labels: ["Picked","Remaining"],
      datasets: [
        {
          data: [p, t-p],
          backgroundColor: ["#7ac77d","#cfcfcf"]
        }
      ]
    };
  };

  return (
    <Container>
      <ProfileCard>
        <Avatar src={avatarSrc} alt={profile.name} />
        <Info>
          <Name>{profile.name}</Name>
          <Stat>{profile.gender}, age {profile.age} (b. {profile.birthday})</Stat>
          <Stat>Height: {profile.height} | Blood Type: {profile.bloodType}</Stat>
          <Stat>Stage: {profile.stage}</Stat>
          <Stat>{profile.condition}</Stat>
        </Info>
      </ProfileCard>

      <SectionTitle>Games</SectionTitle>
      <GameButton onClick={() => { setSelectedGame("apples"); setSelectedSession(null); }}>
        Pick Up All the Apples
      </GameButton>
      <GameButton onClick={() => { setSelectedGame("hanoi"); setSelectedSession(null); }}>
        Tower of Hanoi
      </GameButton>
      <GameButton onClick={() => { setSelectedGame("darts"); setSelectedSession(null); }}>
        Darts
      </GameButton>

      {selectedGame === "apples" && (
        <>
          <SectionTitle>Select Session</SectionTitle>
          <SessionsContainer>
            {appleSessions.map(sess => (
              <SessionButton
                key={sess.id}
                active={selectedSession?.id === sess.id}
                onClick={() => setSelectedSession(sess)}
              >
                {sess.id}
              </SessionButton>
            ))}
          </SessionsContainer>
          {selectedSession && (
            <>
              <ChartWrapper>
                <h3>Hand Velocity (Line)</h3>
                <Line data={makeVelocityChart(selectedSession)} />
              </ChartWrapper>
              <ChartWrapper>
                <h3>Arm Shakes (Bar)</h3>
                <Bar data={makeShakeChart(selectedSession)} />
              </ChartWrapper>
              <ChartWrapper>
                <h3>Apples Picked (Pie)</h3>
                <Pie data={makePieChart(selectedSession)} />
              </ChartWrapper>
            </>
          )}
        </>
      )}

      {selectedGame === "hanoi" && (
        <ChartWrapper>
          <h3>Tower of Hanoi Data</h3>
          <p>Coming soon: move counts, time to completion, error rate.</p>
        </ChartWrapper>
      )}

      {selectedGame === "darts" && (
        <ChartWrapper>
          <h3>Darts Data</h3>
          <p>Coming soon: accuracy heatmap, average score, bullseye rate.</p>
        </ChartWrapper>
      )}
    </Container>
  );
}
