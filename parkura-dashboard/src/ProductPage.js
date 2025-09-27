// src/ProductPage.js
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled.div`
  padding: 4rem 5%;
  max-width: 800px;
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

export default function ProductPage() {
  return (
    <Container>
      <Section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Title>Our Product</Title>
        <Text>
          <strong>What it does:</strong><br />
          Parkura offers VR-based mobility exercises—guided movements, object manipulation, and gamified routines.
          It captures detailed motion data on range of motion, balance, and coordination, then delivers it via a secure dashboard.
          Therapists can monitor progress and adjust treatment in real time.
        </Text>
      </Section>

      <Section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Text>
          <strong>How we built it:</strong><br />
          We developed the VR experiences in Unity and integrated them with a React-based web dashboard for therapists.
          Exercises are designed for safety and engagement, especially for elderly users. Motion metrics are transmitted
          securely to enable a continuous feedback loop.
        </Text>
      </Section>
    </Container>
  );
}
