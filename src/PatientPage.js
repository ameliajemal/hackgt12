import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

// Local avatar imports
import AmeliaImg   from "./avatars/Amelia_Jemal.png";
import AdeleImg    from "./avatars/Adele_Shen.png";
import AlexImg     from "./avatars/Alex_Zou.png";
import AmeliaFall  from "./avatars/AmeliaDefault.png";
import AdeleFall   from "./avatars/AdeleDefault.png";
import AlexFall    from "./avatars/AlexDefault.png";
import DefaultImg  from "./avatars/default.png";

// Avatar mapping
const AVATARS = {
  "Amelia_Jemal": AmeliaImg,
  "Adele_Shen": AdeleImg,
  "Alex_Zou": AlexImg,
  "Amelia Jemal": AmeliaImg,
  "Adele Shen": AdeleImg,
  "Alex Zou": AlexImg,
  "Amelia_fallback": AmeliaFall,
  "Adele_fallback": AdeleFall,
  "Alex_fallback": AlexFall,
  "default": DefaultImg
};

// Styled Components
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
  margin-bottom: 1.5rem;
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
  margin: 0 0 1rem;
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

const AddSectionButton = styled.button`
  margin-bottom: 1rem;
  padding: 0.8rem 1.5rem;
  background-color: #28a745;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:hover { background-color: #218838; }
`;

const CustomSectionCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
  margin-bottom: 1.5rem;
  border-left: 4px solid #7ac77d;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SectionName = styled.h4`
  color: #7ac77d;
  margin: 0;
  flex-grow: 1;
`;

const DeleteSectionButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  &:hover { background: #c82333; }
`;

const FileUploadSection = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  border: 2px dashed #7ac77d;
  border-radius: 8px;
`;

const HandUploadContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin: 1rem 0;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const HandUploadSection = styled.div`
  flex: 1;
  padding: 1rem;
  border: 2px solid ${props => props.active ? '#7ac77d' : '#e0e0e0'};
  border-radius: 8px;
  background: ${props => props.active ? '#f8fff8' : '#f9f9f9'};
  transition: all 0.3s ease;
`;

const HandTitle = styled.h5`
  color: ${props => props.active ? '#7ac77d' : '#666'};
  margin: 0 0 1rem 0;
  text-align: center;
`;

const FileInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const TabContainer = styled.div`
  margin-top: 1rem;
`;

const TabButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const TabButton = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  background: ${props => props.active ? '#7ac77d' : '#e0e0e0'};
  color: ${props => props.active ? 'white' : '#666'};
  
  &:hover {
    background: ${props => props.active ? '#63b465' : '#d0d0d0'};
  }
`;

const TabContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0 15px 15px 15px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #7ac77d, #63b465);
  color: white;
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const ChartContainer = styled.div`
  margin-bottom: 2rem;
`;

const ChartTitle = styled.h4`
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  width: 90%;
  max-width: 400px;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin: 1rem 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const ModalButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  ${props => props.primary ? `
    background: #7ac77d;
    color: white;
    &:hover { background: #63b465; }
  ` : `
    background: #6c757d;
    color: white;
    &:hover { background: #5a6268; }
  `}
`;

// Data parsing functions
const parseHandData = (fileContent) => {
  const lines = fileContent.split('\n');
  const data = {};
  
  // Parse each line
  lines.forEach(line => {
    if (line.includes('AvgVelocity:')) {
      data.avgVelocity = parseFloat(line.split('AvgVelocity:')[1].trim());
    } else if (line.includes('Frequency:')) {
      const value = parseFloat(line.split('Frequency:')[1]); // no trim()
      data.frequency = Math.round(value * 1000) / 1000;
    } else if (line.includes('ApplesPicked:')) {
      data.applesPicked = parseInt(line.split('ApplesPicked:')[1].trim());
    } else if (line.includes('TotalApples:')) {
      data.totalApples = parseInt(line.split('TotalApples:')[1].trim());
    } else if (line.includes('VelocityData:')) {
      const velocityStr = line.split('VelocityData:')[1].trim();
      const velocityArray = velocityStr.slice(1, -1).split(',');
      data.velocityData = velocityArray.map(v => parseFloat(v.trim()));
    } else if (line.includes('ShakeData:')) {
      const shakeStr = line.split('ShakeData:')[1].trim();
      const shakeArray = shakeStr.slice(1, -1).split(',');
      data.shakeData = shakeArray.map(s => parseFloat(s.trim()));
    } else if (line.includes('Positions:')) {
      const posStr = line.split('Positions:')[1].trim();
      // Parse position data - simplified for this example
      data.positions = posStr;
    }
  });
  
  return data;
};

const prepareChartData = (velocityData, shakeData) => {
  const chartData = [];
  const maxLength = Math.max(velocityData?.length || 0, shakeData?.length || 0);
  
  for (let i = 0; i < maxLength; i++) {
    chartData.push({
      time: i,
      velocity: velocityData?.[i] || 0,
      shake: shakeData?.[i] || 0
    });
  }
  
  return chartData;
};

export default function PatientPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const [data, setData] = useState(null);
  const [customSections, setCustomSections] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [activeTab, setActiveTab] = useState('left');

  useEffect(() => {
    if (state?.patientData) {
      setData(state.patientData);
    }
  }, [state]);

  if (!data) {
    return <Container>Loading patient data…</Container>;
  }

  const getAvatarSrc = () => {
    const patientName = data.name;
    if (AVATARS[patientName]) return AVATARS[patientName];
    const underscoreName = patientName?.replace(/\s+/g, "_");
    if (AVATARS[underscoreName]) return AVATARS[underscoreName];
    return AVATARS.default;
  };

  const handleFileUpload = async (event, sectionId, hand) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.txt')) {
      alert('Please select a .txt file');
      return;
    }

    try {
      const fileContent = await file.text();
      const parsedData = parseHandData(fileContent);
      
      setCustomSections(prev =>
        prev.map(s =>
          s.id === sectionId
            ? {
                ...s,
                hands: {
                  ...s.hands,
                  [hand]: {
                    fileName: file.name,
                    uploadedAt: new Date().toISOString(),
                    data: parsedData
                  }
                }
              }
            : s
        )
      );
    } catch (error) {
      console.error('Error parsing file:', error);
      alert('Error parsing file. Please check the file format.');
    }
  };

  const addCustomSection = () => {
    if (!newSectionName.trim()) return;
    const newSection = {
      id: Date.now().toString(),
      name: newSectionName.trim(),
      hands: {
        left: null,
        right: null
      },
      createdAt: new Date().toISOString()
    };

    setCustomSections(prev => [...prev, newSection]);
    setNewSectionName("");
    setShowAddModal(false);
  };

  const deleteCustomSection = (sectionId) => {
    setCustomSections(prev => prev.filter(s => s.id !== sectionId));
  };

  const renderHandAnalytics = (section) => {
    const leftData = section.hands?.left?.data;
    const rightData = section.hands?.right?.data;
    const currentData = activeTab === 'left' ? leftData : rightData;
    
    if (!currentData) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          No data available for {activeTab} hand. Please upload a .txt file.
        </div>
      );
    }

    const chartData = prepareChartData(currentData.velocityData, currentData.shakeData);
    
    return (
      <>
        <StatsGrid>
          <StatCard>
            <StatValue>
              {currentData.applesPicked || 0}/{currentData.totalApples || 0}
            </StatValue>
            <StatLabel>Apples Picked</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{(currentData.frequency || 0).toFixed(3)}</StatValue>
            <StatLabel>Tremor Intensity</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{(currentData.avgVelocity || 0).toFixed(2)}</StatValue>
            <StatLabel>Average Velocity</StatLabel>
          </StatCard>
        </StatsGrid>

        <ChartContainer>
          <ChartTitle>Velocity Over Time</ChartTitle>
           <p style={{ textAlign: 'center', color: '#555' }}>
            This graph tracks how quickly the patient moves their hand over time during the game. Physical therapists can use this to identify periods of slower or uneven movement, monitor improvements in motor control, and adjust therapy exercises for better hand coordination and engagement.
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="velocity" 
                stroke="#7ac77d" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer>
          <ChartTitle>Shake Intensity Over Time</ChartTitle>
          <p style={{ textAlign: 'center', color: '#555' }}>
            This graph shows tremor intensity throughout the session. 
            Physical therapists can use it to detect moments of increased tremor, 
            evaluate the effectiveness of exercises, and track the progression or improvement 
            of hand stability in Parkinson’s patients over time.
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="shake" 
                stroke="#7ac77d" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </>
    );
  };

  const avatarSrc = getAvatarSrc();

  return (
    <Container>
      <ProfileCard>
        <Avatar src={avatarSrc} alt={data.name} />
        <Info>
          <Name>{data.name}</Name>
          <Stat>Gender: {data.gender}</Stat>
          <Stat>Age: {data.age}</Stat>
          <Stat>Birthday: {data.birthday}</Stat>
          <Stat>Height: {data.height}</Stat>
          <Stat>Blood Type: {data.bloodType}</Stat>
          <Stat>Stage: {data.stage}</Stat>
          <Stat>Diagnosis: {data.condition}</Stat>
        </Info>
      </ProfileCard>

      <SectionTitle>Games</SectionTitle>
      <GameButton>Pick Up All the Apples</GameButton>
      <GameButton>Tower of Hanoi</GameButton>
      <GameButton>Darts</GameButton>

      <SectionTitle>Hand Motion Analytics Sessions</SectionTitle>
      <AddSectionButton onClick={() => setShowAddModal(true)}>
        <span>+</span> Add New Section
      </AddSectionButton>

      {customSections.map(section => (
        <CustomSectionCard key={section.id}>
          <SectionHeader>
            <SectionName>{section.name}</SectionName>
            <DeleteSectionButton onClick={() => deleteCustomSection(section.id)}>
              Delete
            </DeleteSectionButton>
          </SectionHeader>

          <FileUploadSection>
            <p>Upload .txt files for each hand</p>
            <HandUploadContainer>
              <HandUploadSection active={section.hands?.left}>
                <HandTitle active={section.hands?.left}>
                  Left Hand {section.hands?.left?.fileName ? `(${section.hands.left.fileName})` : ''}
                </HandTitle>
                <FileInput
                  type="file"
                  accept=".txt"
                  onChange={(e) => handleFileUpload(e, section.id, 'left')}
                />
              </HandUploadSection>
              <HandUploadSection active={section.hands?.right}>
                <HandTitle active={section.hands?.right}>
                  Right Hand {section.hands?.right?.fileName ? `(${section.hands.right.fileName})` : ''}
                </HandTitle>
                <FileInput
                  type="file"
                  accept=".txt"
                  onChange={(e) => handleFileUpload(e, section.id, 'right')}
                />
              </HandUploadSection>
            </HandUploadContainer>
          </FileUploadSection>

          {(section.hands?.left?.data || section.hands?.right?.data) && (
            <TabContainer>
              <TabButtons>
                <TabButton 
                  active={activeTab === 'left'} 
                  onClick={() => setActiveTab('left')}
                  disabled={!section.hands?.left?.data}
                >
                  Left Hand {}
                </TabButton>
                <TabButton 
                  active={activeTab === 'right'} 
                  onClick={() => setActiveTab('right')}
                  disabled={!section.hands?.right?.data}
                >
                  Right Hand {}
                </TabButton>
              </TabButtons>
              <TabContent>
                {renderHandAnalytics(section)}
              </TabContent>
            </TabContainer>
          )}
        </CustomSectionCard>
      ))}

      {showAddModal && (
        <Modal onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}>
          <ModalContent>
            <h3>Add New Data Section</h3>
            <ModalInput
              type="text"
              placeholder="Enter section name..."
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomSection()}
            />
            <ModalButtons>
              <ModalButton onClick={() => setShowAddModal(false)}>Cancel</ModalButton>
              <ModalButton primary onClick={addCustomSection}>Add Section</ModalButton>
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}