import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

// local avatar imports
import AmeliaImg  from "./avatars/Amelia_Jemal.png";
import AlexImg    from "./avatars/Alex_Zou.png";
import AdeleImg   from "./avatars/Adele_Shen.png";
import DefaultImg from "./avatars/default.png";

const AVATARS = {
  AmeliaJemal: AmeliaImg,
  AlexZou:     AlexImg,
  AdeleShen:   AdeleImg
};

// hard-coded profiles
const PATIENT_PROFILES = [
  {
    id: "AmeliaJemal",
    name: "Amelia Jemal",
    gender: "Woman",
    age: 19,
    birthday: "June 2, 2006",
    height: "5'4\"",
    bloodType: "O+",
    condition: "Parkinson's Disease",
    stage: "Early"
  },
  {
    id: "AlexZou",
    name: "Alex Zou",
    gender: "Man",
    age: 20,
    birthday: "March 29, 2005",
    height: "5'10\"",
    bloodType: "A-",
    condition: "Parkinson's Disease",
    stage: "Middle"
  },
  {
    id: "AdeleShen",
    name: "Adele Shen",
    gender: "Woman",
    age: 20,
    birthday: "March 9, 2005",
    height: "5'5\"",
    bloodType: "B+",
    condition: "Parkinson's Disease",
    stage: "Late"
  }
];

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
  return (
    <Container>
      <Header>Patient Dashboard</Header>
      <Grid>
        {PATIENT_PROFILES.map((p) => {
          const avatarSrc = AVATARS[p.id] || DefaultImg;

          return (
            <Link
              key={p.id}
              to={`/patient/${p.id}`}
              state={{ patientData: p }}
              style={{ textDecoration: "none" }}
            >
              <Card>
                <Avatar src={avatarSrc} alt={p.name} />
                <h3 style={{ color: "#333" }}>{p.name}</h3>
                <p>{p.gender}, age {p.age} (b. {p.birthday})</p>
                <p>Height: {p.height} | Blood Type: {p.bloodType}</p>
                <p>Stage: {p.stage}</p>
                <p>{p.condition}</p>
              </Card>
            </Link>
          );
        })}
      </Grid>
    </Container>
  );
}
