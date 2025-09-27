// src/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Player } from '@lottiefiles/react-lottie-player';
import { motion } from 'framer-motion';

const Hero = styled.section`
  position: relative;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #f4f7fc 0%, #e1e8f0 100%);
`;

const HeroOverlay = styled(Player)`
  position: absolute;
  top: 0;
  left: 50%;
  width: 180%;
  transform: translateX(-50%);
  opacity: 0.2;
`;

const HeroContent = styled(motion.div)`
  position: relative;
  text-align: center;
  max-width: 600px;
  padding: 0 1rem;
`;

const Title = styled.h1`
  font-size: 4rem;
  margin-bottom: 1rem;
  color: var(--color-primary);
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  color: #555;
`;

const CTAButton = styled(motion.button)`
  background-color: var(--color-primary);
  color: white;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  border: none;
`;

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Hero>
      <HeroOverlay
        autoplay
        loop
        src="https://assets10.lottiefiles.com/packages/lf20_u4yrau.json"
      />
      <HeroContent
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title>Parkura</Title>
        <Subtitle>
          Immersive VR therapy for Parkinson’s patients. Empowering therapists with real-time data.
        </Subtitle>
        <CTAButton
          whileHover={{ scale: 1.05, boxShadow: '0px 8px 20px rgba(0,0,0,0.15)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/login')}
        >
          Get Started
        </CTAButton>
      </HeroContent>
    </Hero>
  );
}
