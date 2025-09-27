// src/AboutPage.js
import React from 'react';
import styled from 'styled-components';
import { Pie, Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Container = styled.div`
  padding: 4rem 5%;
  max-width: 900px;
  margin: 0 auto;
`;

const Section = styled(motion.section)`
  margin-bottom: 3rem;
`;

const Title = styled.h2`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Text = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #555;
`;

export default function AboutPage() {
  const pieData = {
    labels: ['Over 60', 'Under 50'],
    datasets: [{ data: [90, 10], backgroundColor: ['#7ac77d', '#5fa45a'] }],
  };

  const barData = {
    labels: ['Direct Costs', 'Indirect Costs'],
    datasets: [{ data: [14, 6.3], backgroundColor: '#7ac77d' }],
  };

  return (
    <Container>
      <Section
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Title>About Us</Title>
        <Text>
          Parkura is a mission-driven platform dedicated to improving mobility and confidence for individuals with Parkinson’s disease. 
          We blend immersive VR technology with clinical insight to deliver personalized therapy experiences and empower therapists with actionable data.
        </Text>
      </Section>

      <Section
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Title>Parkinson’s by the Numbers</Title>
        <Text>
          An estimated 500,000 to 1,000,000 Americans have Parkinson’s disease. Most are over 60, though 5–10% are diagnosed before 50. 
          Direct treatment costs exceed $14 billion annually, plus $6.3 billion in lost productivity.
        </Text>

        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ maxWidth: 360 }}>
            <Pie data={pieData} />
          </div>
          <div style={{ maxWidth: 360 }}>
            <Bar data={barData} />
          </div>
        </div>
      </Section>
    </Container>
  );
}
