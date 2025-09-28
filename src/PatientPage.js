// src/PatientPage.js
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Line, Bar, Pie, Scatter } from "react-chartjs-2";
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

// Local avatar imports
import AmeliaImg   from "./avatars/Amelia_Jemal.png";
import AdeleImg    from "./avatars/Adele_Shen.png";
import AlexImg     from "./avatars/Alex_Zou.png";
import AmeliaFall  from "./avatars/AmeliaDefault.png";
import AdeleFall   from "./avatars/AdeleDefault.png";
import AlexFall    from "./avatars/AlexDefault.png";
import DefaultImg  from "./avatars/default.png";

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

// localStorage functions
const STORAGE_KEY = 'patientCustomSections';

const loadCustomSections = (patientId) => {
  try {
    const saved = localStorage.getItem(`${STORAGE_KEY}_${patientId}`);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading saved sections:', error);
    return [];
  }
};

const saveCustomSections = (patientId, sections) => {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${patientId}`, JSON.stringify(sections));
  } catch (error) {
    console.error('Error saving sections:', error);
  }
};

// Signal Analysis Functions
const analyzeTremorData = (velocityData, shakeData, shakyScore, applesPicked, totalApples) => {
  const velocity = velocityData || [];
  
  const results = {};
  
  // Basic statistics
  results['avg_velocity'] = velocity.length ? velocity.reduce((a, b) => a + b, 0) / velocity.length : 0;
  results['max_velocity'] = velocity.length ? Math.max(...velocity) : 0;
  
  // Tremor intensity analysis
  results['tremor_intensity'] = velocity.length ? 
    velocity.sort((a, b) => a - b)[Math.floor(velocity.length * 0.95)] : 0;
  
  // Frequency analysis using FFT (simplified)
  if (velocity.length > 10) {
    const sampling_rate = 100;
    const n = velocity.length;
    
    // Simple frequency analysis - find dominant frequency
    const frequencies = [];
    for (let freq = 0.5; freq <= 12; freq += 0.1) {
      let power = 0;
      for (let i = 0; i < n; i++) {
        power += velocity[i] * Math.cos(2 * Math.PI * freq * i / sampling_rate);
      }
      frequencies.push({ freq, power: Math.abs(power) });
    }
    
    const dominant = frequencies.reduce((max, curr) => curr.power > max.power ? curr : max, frequencies[0]);
    results['dominant_frequency'] = dominant.freq;
    results['frequency_power'] = dominant.power;
  } else {
    results['dominant_frequency'] = 0;
    results['frequency_power'] = 0;
  }
  
  // Task performance
  results['success_rate'] = totalApples > 0 ? applesPicked / totalApples : 0;
  results['shaky_score'] = shakyScore || 0;
  
  return results;
};

const calculateUPDRSScore = (analysisResults) => {
  const intensity = analysisResults['tremor_intensity'] || 0;
  const freq_power = analysisResults['frequency_power'] || 0;
  const success_rate = analysisResults['success_rate'] || 0;
  const dominant_freq = analysisResults['dominant_frequency'] || 0;
  
  // Check if frequency matches Parkinson's pattern
  const is_parkinsons_frequency = (3.5 <= dominant_freq && dominant_freq <= 7);
  
  const score_components = [];
  
  // Intensity component
  if (intensity < 0.5) score_components.push(0);
  else if (intensity < 1.0) score_components.push(1);
  else if (intensity < 2.0) score_components.push(2);
  else if (intensity < 3.0) score_components.push(3);
  else score_components.push(4);
  
  // Frequency power component
  if (freq_power < 100) score_components.push(0);
  else if (freq_power < 300) score_components.push(1);
  else if (freq_power < 600) score_components.push(2);
  else if (freq_power < 1000) score_components.push(3);
  else score_components.push(4);
  
  // Performance component
  if (success_rate > 0.9) score_components.push(0);
  else if (success_rate > 0.7) score_components.push(1);
  else if (success_rate > 0.5) score_components.push(2);
  else if (success_rate > 0.3) score_components.push(3);
  else score_components.push(4);
  
  // Calculate base score
  let base_score = score_components.reduce((a, b) => a + b, 0) / score_components.length;
  
  // Adjust score based on frequency match
  if (!is_parkinsons_frequency) {
    base_score = base_score * 0.3;
  }
  
  const final_score = Math.round(base_score);
  return Math.min(final_score, 4);
};

// Generate mock velocity data
const generateVelocityData = (base, variation, count = 50) => {
  return Array.from({ length: count }, (_, i) => 
    base + (Math.random() * variation * 2 - variation)
  );
};

// Generate mock shake data
const generateShakeData = (base, variation, count = 50) => {
  return Array.from({ length: count }, (_, i) => 
    Math.max(0, base + (Math.random() * variation * 2 - variation))
  );
};

// Generate tremor frequency data for scatter plot
const generateTremorScatterData = (baseFreq, baseAmp, count = 20) => {
  return Array.from({ length: count }, (_, i) => ({
    x: Math.max(0.1, baseFreq + (Math.random() * 2 - 1)),
    y: Math.max(0.1, baseAmp + (Math.random() * 1.5 - 0.75))
  }));
};

// Generate time labels for charts
const generateTimeLabels = (dataLength) => {
  return Array.from({ length: dataLength }, (_, i) => `${(i * 0.1).toFixed(1)}s`);
};

// Generate frequency spectrum data
const generateFrequencyData = (dominantFreq, count = 100) => {
  const freqs = Array.from({ length: count }, (_, i) => i * 0.12);
  const magnitudes = freqs.map(freq => {
    const distance = Math.abs(freq - dominantFreq);
    return Math.exp(-distance * distance * 10) * 1000 + Math.random() * 100;
  });
  return { freqs, magnitudes };
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

const ViewChartsButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #7ac77d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 1rem;
  transition: 0.2s;
  &:hover { background-color: #63b465; }
`;

const CloseChartsButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #7b7b7bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 1rem;
  transition: 0.2s;
  &:hover { background-color: #000000ff; }
`;

const ChartWrapper = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
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

const HandTabsContainer = styled.div`
  display: flex;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 4px;
  margin: 2rem 0;
`;

const HandTab = styled.button`
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  background: ${props => props.active ? '#007bff' : 'transparent'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  &:hover {
    background: ${props => props.active ? '#0056b3' : '#e9ecef'};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

const StatCard = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
  border-left: 4px solid ${props => props.hand === 'left' ? '#007bff' : '#007bff'};
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.hand === 'left' ? '#007bff' : '#007bff'};
  margin-bottom: 0.5rem;
`;

const AnalysisSection = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
`;

const AnalysisTitle = styled.h4`
  color: #856404;
  margin: 0 0 1rem 0;
`;

const AnalysisText = styled.p`
  color: #856404;
  margin: 0.5rem 0;
  line-height: 1.5;
`;

const ClinicalZones = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  border-left: 4px solid #6c757d;
`;

const ZoneItem = styled.div`
  margin: 0.5rem 0;
  padding: 0.5rem;
  border-radius: 4px;
  background: ${props => props.color}20;
  border-left: 4px solid ${props => props.color};
`;

const ScoreCard = styled.div`
  background: ${props => {
    if (props.score === 0) return '#d4edda';
    if (props.score === 1) return '#fff3cd';
    if (props.score === 2) return '#ffeaa7';
    if (props.score === 3) return '#f8d7da';
    return '#dc3545';
  }};
  border: 2px solid ${props => {
    if (props.score === 0) return '#c3e6cb';
    if (props.score === 1) return '#ffeaa7';
    if (props.score === 2) return '#ffd966';
    if (props.score === 3) return '#f5c6cb';
    return '#dc3545';
  }};
  border-radius: 10px;
  padding: 1.5rem;
  margin: 1rem 0;
  text-align: center;
`;

const ScoreNumber = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: ${props => {
    if (props.score === 0) return '#155724';
    if (props.score === 1) return '#856404';
    if (props.score === 2) return '#856404';
    if (props.score === 3) return '#721c24';
    return '#721c24';
  }};
  margin-bottom: 0.5rem;
`;

const ScoreLabel = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => {
    if (props.score === 0) return '#155724';
    if (props.score === 1) return '#856404';
    if (props.score === 2) return '#856404';
    if (props.score === 3) return '#721c24';
    return '#721c24';
  }};
  margin-bottom: 0.5rem;
`;

const ScoreDescription = styled.div`
  color: ${props => {
    if (props.score === 0) return '#155724';
    if (props.score === 1) return '#856404';
    if (props.score === 2) return '#856404';
    if (props.score === 3) return '#721c24';
    return '#721c24';
  }};
  font-size: 0.9rem;
`;

export default function PatientPage() {
  const { id: rawId } = useParams();
  const { state } = useLocation();
  const [data, setData] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [customSections, setCustomSections] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [selectedHand, setSelectedHand] = useState("left");

  // Load saved sections when component mounts
  useEffect(() => {
    if (rawId) {
      const savedSections = loadCustomSections(rawId);
      setCustomSections(savedSections);
    }
  }, [rawId]);

  // Save sections whenever they change
  useEffect(() => {
    if (rawId && customSections.length >= 0) {
      saveCustomSections(rawId, customSections);
    }
  }, [customSections, rawId]);

  useEffect(() => {
    if (state?.patientData) {
      setData(state.patientData);
    }
  }, [state]);

  if (!data) {
    return <Container>Loading patient data…</Container>;
  }

  // Function to get the correct avatar
  const getAvatarSrc = () => {
    const patientName = data.name;
    
    if (AVATARS[patientName]) return AVATARS[patientName];
    
    const underscoreName = patientName?.replace(/\s+/g, "_");
    if (AVATARS[underscoreName]) return AVATARS[underscoreName];
    
    const spaceName = patientName?.replace(/_+/g, " ");
    if (AVATARS[spaceName]) return AVATARS[spaceName];
    
    const firstName = patientName?.split(/[\s_]/)[0];
    const fallbackKey = firstName + "_fallback";
    if (AVATARS[fallbackKey]) return AVATARS[fallbackKey];
    
    return AVATARS.default;
  };

  // Parse text file data
  const parseTextFile = (text, sectionName) => {
    // Check if this is medical data format
    if (text.includes('AvgVelocity:') && text.includes('VelocityData:') && text.includes('ShakeData:')) {
      return parseMedicalData(text);
    }
    
    // Parse tremor analysis format
    if (text.includes('TREMOR FREQUENCY ANALYSIS')) {
      return parseTremorAnalysis(text);
    }
    
    // Original parsing for other formats
    const lines = text.split('\n').filter(line => line.trim());
    const data = [];
    const labels = [];
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine || trimmedLine.toLowerCase().includes('time') || 
          trimmedLine.toLowerCase().includes('value') || 
          trimmedLine.toLowerCase().includes('data')) {
        return;
      }
      
      if (trimmedLine.includes(',')) {
        const [label, value] = trimmedLine.split(',').map(s => s.trim());
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          labels.push(label || `Point ${index + 1}`);
          data.push(numValue);
        }
      } else if (trimmedLine.includes('\t')) {
        const [label, value] = trimmedLine.split('\t').map(s => s.trim());
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          labels.push(label || `Point ${index + 1}`);
          data.push(numValue);
        }
      } else {
        const numValue = parseFloat(trimmedLine);
        if (!isNaN(numValue)) {
          labels.push(`Point ${labels.length + 1}`);
          data.push(numValue);
        }
      }
    });
    
    return { labels, data };
  };

  // Parse medical data format specifically
  const parseMedicalData = (text) => {
    const result = {
      avgVelocity: 0,
      shaky: 0,
      velocityData: [],
      shakeData: [],
      positionData: [],
      applesPicked: 0,
      totalApples: 0,
      completionPercentage: 0,
      tremorFrequency: 5.07,
      parkinsonsMatch: false,
      signalAnalysis: null
    };
    
    // Extract basic stats
    const avgVelocityMatch = text.match(/AvgVelocity:\s*([\d.]+)/);
    if (avgVelocityMatch) result.avgVelocity = parseFloat(avgVelocityMatch[1]);
    
    const shakyMatch = text.match(/Shaky:\s*([\d.]+)/);
    if (shakyMatch) result.shaky = parseFloat(shakyMatch[1]);
    
    const applesPickedMatch = text.match(/ApplesPicked:\s*(\d+)/);
    if (applesPickedMatch) result.applesPicked = parseInt(applesPickedMatch[1]);
    
    const totalApplesMatch = text.match(/TotalApples:\s*(\d+)/);
    if (totalApplesMatch) result.totalApples = parseInt(totalApplesMatch[1]);
    
    // Calculate completion percentage
    if (result.totalApples > 0) {
      result.completionPercentage = Math.round((result.applesPicked / result.totalApples) * 100);
    }
    
    // Extract velocity data array
    const velocityMatch = text.match(/VelocityData:\s*\[([\d.,\s]+)\]/);
    if (velocityMatch) {
      result.velocityData = velocityMatch[1]
        .split(',')
        .map(v => parseFloat(v.trim()))
        .filter(v => !isNaN(v));
    }
    
    // Extract shake data array
    const shakeMatch = text.match(/ShakeData:\s*\[([\d.,\s]+)\]/);
    if (shakeMatch) {
      result.shakeData = shakeMatch[1]
        .split(',')
        .map(v => parseFloat(v.trim()))
        .filter(v => !isNaN(v));
    }
    
    // Perform signal analysis
    if (result.velocityData.length > 0) {
      const analysisResults = analyzeTremorData(
        result.velocityData,
        result.shakeData,
        result.shaky,
        result.applesPicked,
        result.totalApples
      );
      
      result.signalAnalysis = analysisResults;
      result.tremorFrequency = analysisResults.dominant_frequency;
      result.parkinsonsMatch = (analysisResults.dominant_frequency >= 3.5 && analysisResults.dominant_frequency <= 7);
      result.updrsScore = calculateUPDRSScore(analysisResults);
    }
    
    return result;
  };

  // Parse tremor analysis format
  const parseTremorAnalysis = (text) => {
    const result = {
      tremorFrequency: 0.53,
      parkinsonsMatch: false,
      analysis: "",
      velocityData: generateVelocityData(1.2, 0.3, 30),
      shakeData: generateShakeData(0.5, 0.2, 30),
      avgVelocity: 1.18,
      shaky: 0.53,
      updrsScore: 1
    };
    
    // Extract tremor frequency
    const freqMatch = text.match(/Your tremor:\s*([\d.]+)\s*Hz/);
    if (freqMatch) {
      result.tremorFrequency = parseFloat(freqMatch[1]);
      result.parkinsonsMatch = (result.tremorFrequency >= 4 && result.tremorFrequency <= 6);
    }
    
    // Also check text for explicit match statements
    if (text.includes('MATCH Parkinson') || text.includes('Matches Parkinson')) {
      result.parkinsonsMatch = true;
    } else if (text.includes('NO MATCH') || text.includes('Does not match')) {
      result.parkinsonsMatch = false;
    }
    
    return result;
  };

  // Handle file upload for specific hand
  const handleFileUpload = (event, sectionId, hand) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.name.toLowerCase().endsWith('.txt')) {
      alert('Please select a .txt file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const section = customSections.find(s => s.id === sectionId);
      
      if (section) {
        const parsedData = parseTextFile(text, section.name);
        
        setCustomSections(prev => 
          prev.map(s => 
            s.id === sectionId 
              ? { 
                  ...s, 
                  hands: {
                    ...s.hands,
                    [hand]: {
                      fileData: parsedData,
                      fileName: file.name,
                      uploadedAt: new Date().toISOString()
                    }
                  }
                }
              : s
          )
        );
      }
    };
    
    reader.onerror = () => {
      alert('Error reading file');
    };
    
    reader.readAsText(file);
  };

  // Add new custom section
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

  // Delete custom section
  const deleteCustomSection = (sectionId) => {
    setCustomSections(prev => prev.filter(s => s.id !== sectionId));
    if (selectedSection?.id === sectionId) {
      setSelectedSection(null);
    }
  };

  // Create charts from uploaded data
  const createChartsFromData = (fileData, hand) => {
    const timeLabels = generateTimeLabels(fileData.velocityData?.length || 30);
    
    // Velocity Chart
    const velocityChart = {
      labels: timeLabels,
      datasets: [{
        label: `Hand Velocity (m/s) - ${hand} hand`,
        data: fileData.velocityData || generateVelocityData(1.2, 0.3, 30),
        borderColor: hand === 'left' ? '#007bff' : '#007bff',
        backgroundColor: hand === 'left' ? 'rgba(0, 123, 255, 0.1)' : 'rgba(0, 123, 255, 0.1)',
        tension: 0.3,
        fill: true,
        pointRadius: 2
      }]
    };

    // Tremor Chart
    const tremorChart = {
      labels: timeLabels.slice(0, fileData.shakeData?.length || 30),
      datasets: [{
        label: `Tremor Intensity (rad/s) - ${hand} hand`,
        data: fileData.shakeData || generateShakeData(0.5, 0.2, 30),
        borderColor: hand === 'left' ? '#007bff' : '#007bff',
        backgroundColor: hand === 'left' ? 'rgba(0, 123, 255, 0.2)' : 'rgba(0, 123, 255, 0.2)',
        tension: 0.3,
        fill: true,
        pointRadius: 2
      }]
    };

    // Tremor Frequency vs Amplitude Scatter Plot
    const tremorScatterChart = {
      datasets: [{
        label: 'Tremor Events',
        data: generateTremorScatterData(fileData.tremorFrequency || 5.07, 2.0, 15),
        backgroundColor: hand === 'left' ? '#007bff' : '#007bff',
        pointRadius: 8,
        pointHoverRadius: 10
      }]
    };

    // Frequency Spectrum Chart
    const freqData = generateFrequencyData(fileData.tremorFrequency || 5.07);
    const frequencyChart = {
      labels: freqData.freqs.map(f => f.toFixed(1)),
      datasets: [{
        label: 'Frequency Spectrum',
        data: freqData.magnitudes,
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        tension: 0.3,
        fill: true
      }]
    };

    return { velocityChart, tremorChart, tremorScatterChart, frequencyChart };
  };

  // Game button handlers
  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const avatarSrc = getAvatarSrc();

  return (
    <Container>
      <ProfileCard>
        <Avatar 
          src={avatarSrc} 
          alt={data.name}
          onError={(e) => {
            e.target.src = AVATARS.default;
          }}
        />
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
      <GameButton onClick={() => handleGameClick("apples")}>
        Pick Up All the Apples
      </GameButton>
      <GameButton onClick={() => handleGameClick("hanoi")}>
        Tower of Hanoi
      </GameButton>
      <GameButton onClick={() => handleGameClick("darts")}>
        Darts
      </GameButton>

      {/* Custom Sections */}
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
          
          {(!section.hands?.left?.fileData || !section.hands?.right?.fileData) && (
            <FileUploadSection>
              <p>Upload .txt files for each hand</p>
              
              <HandUploadContainer>
                <HandUploadSection active={section.hands?.left?.fileData}>
                  <HandTitle active={section.hands?.left?.fileData}>
                    Left Hand {section.hands?.left?.fileName}
                  </HandTitle>
                  <FileInput 
                    type="file" 
                    accept=".txt"
                    onChange={(e) => handleFileUpload(e, section.id, 'left')}
                  />
                </HandUploadSection>

                <HandUploadSection active={section.hands?.right?.fileData}>
                  <HandTitle active={section.hands?.right?.fileData}>
                    Right Hand {section.hands?.right?.fileName}
                  </HandTitle>
                  <FileInput 
                    type="file" 
                    accept=".txt"
                    onChange={(e) => handleFileUpload(e, section.id, 'right')}
                  />
                </HandUploadSection>
              </HandUploadContainer>
            </FileUploadSection>
          )}

          {(section.hands?.left?.fileData || section.hands?.right?.fileData) && (
            <div>
              {selectedSection?.id === section.id ? (
                <CloseChartsButton onClick={() => setSelectedSection(null)}>
                  Close Charts
                </CloseChartsButton>
              ) : (
                <ViewChartsButton onClick={() => setSelectedSection(section)}>
                  View Charts
                </ViewChartsButton>
              )}
            </div>
          )}

          {/* Show charts when section is selected */}
          {selectedSection?.id === section.id && (
            <div>
              {/* Hand Selection Tabs */}
              <HandTabsContainer>
                <HandTab 
                  active={selectedHand === 'left'}
                  onClick={() => setSelectedHand('left')}
                >
                  Left Hand {}
                </HandTab>
                <HandTab 
                  active={selectedHand === 'right'}
                  onClick={() => setSelectedHand('right')}
                >
                  Right Hand {}
                </HandTab>
              </HandTabsContainer>

              {/* Get data for selected hand */}
              {(() => {
                const handData = section.hands[selectedHand]?.fileData;
                if (!handData) {
                  return <p>No data available for {selectedHand} hand</p>;
                }

                const charts = createChartsFromData(handData, selectedHand);
                const updrsScore = handData.updrsScore || 1;
                const scoreDescriptions = [
                  "0: Normal - No significant tremor detected",
                  "1: Slight - Minimal clinical significance", 
                  "2: Mild - Noticeable but not functionally limiting",
                  "3: Moderate - Interferes with daily activities",
                  "4: Severe - Markedly impairs function"
                ];

                return (
                  <>
                    {/* UPDRS Score Card */}
                    <ScoreCard score={updrsScore}>
                      <ScoreNumber score={updrsScore}>{updrsScore}/4</ScoreNumber>
                      <ScoreLabel score={updrsScore}>
                        {["Normal", "Slight", "Mild", "Moderate", "Severe"][updrsScore]} Tremor
                      </ScoreLabel>
                      <ScoreDescription score={updrsScore}>
                        {scoreDescriptions[updrsScore]}
                      </ScoreDescription>
                    </ScoreCard>

                    {/* Tremor Analysis Section */}
                    <AnalysisSection>
                      <AnalysisTitle>SIGNAL ANALYSIS & SCORING</AnalysisTitle>
                      <AnalysisText>
                        <strong>Tremor Frequency:</strong> {handData.tremorFrequency ? handData.tremorFrequency.toFixed(2) : 'NO DATA'} Hz
                        <br />
                        <strong>Parkinson's Pattern Match:</strong> {handData.parkinsonsMatch ? '✅ MATCH' : '❌ NO MATCH'}
                        <br />
                        <strong>Signal Analysis:</strong> {handData.signalAnalysis ? 'Completed' : 'Basic Analysis'}
                        <br />
                        {handData.signalAnalysis && (
                          <>
                            <strong>Avg Velocity:</strong> {handData.signalAnalysis.avg_velocity?.toFixed(3) || 'N/A'} m/s
                            <br />
                            <strong>Tremor Intensity:</strong> {handData.signalAnalysis.tremor_intensity?.toFixed(3) || 'N/A'}
                            <br />
                            <strong>Frequency Power:</strong> {handData.signalAnalysis.frequency_power?.toFixed(1) || 'N/A'}
                          </>
                        )}
                      </AnalysisText>
                    </AnalysisSection>

                    {/* Stats Overview */}
                    <StatsGrid>
                      <StatCard hand={selectedHand}>
                        <StatNumber hand={selectedHand}>
                          {handData.tremorFrequency ? handData.tremorFrequency.toFixed(2) : '0.53'} Hz
                        </StatNumber>
                        <div>Tremor Frequency</div>
                      </StatCard>
                      <StatCard hand={selectedHand}>
                        <StatNumber hand={selectedHand}>
                          {handData.avgVelocity ? handData.avgVelocity.toFixed(2) : '1.18'} m/s
                        </StatNumber>
                        <div>Avg Velocity</div>
                      </StatCard>
                      <StatCard hand={selectedHand}>
                        <StatNumber hand={selectedHand}>
                          {handData.shaky ? handData.shaky.toFixed(2) : '5.07'}
                        </StatNumber>
                        <div>Tremor Intensity</div>
                      </StatCard>
                      <StatCard hand={selectedHand}>
                        <StatNumber hand={selectedHand}>
                          {updrsScore}/4
                        </StatNumber>
                        <div>UPDRS Score</div>
                      </StatCard>
                    </StatsGrid>

                    {/* Frequency Spectrum Chart */}
                    <ChartWrapper>
                      <h3>Frequency Spectrum Analysis</h3>
                      <Line 
                        data={charts.frequencyChart}
                        options={{
                          responsive: true,
                          scales: {
                            y: { 
                              beginAtZero: true, 
                              title: { display: true, text: 'Power Spectral Density' } 
                            },
                            x: { 
                              title: { display: true, text: 'Frequency (Hz)' },
                              min: 0,
                              max: 12
                            }
                          },
                          plugins: {
                            legend: { display: false }
                          }
                        }}
                      />
                      <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                        <strong>Clinical Interpretation:</strong>
                        <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                          Parkinson's disease typically presents with tremors in the 4-6 Hz range. 
                          {handData.parkinsonsMatch 
                            ? ' This analysis shows a pattern consistent with Parkinsonian tremor.'
                            : ' This analysis shows a frequency pattern that does not match typical Parkinsonian tremor.'
                          }
                        </p>
                      </div>
                    </ChartWrapper>

                    {/* Tremor Chart */}
                    <ChartWrapper>
                      <h3>Tremor Hand Visualization</h3>
                      <Line 
                        data={charts.tremorChart}
                        options={{
                          responsive: true,
                          scales: {
                            y: { beginAtZero: true, title: { display: true, text: 'Angular Velocity (rad/s)' } },
                            x: { title: { display: true, text: 'Time (seconds)' } }
                          }
                        }}
                      />
                    </ChartWrapper>

                    {/* Velocity Chart */}
                    <ChartWrapper>
                      <h3>Velocity of Hand</h3>
                      <Line 
                        data={charts.velocityChart}
                        options={{
                          responsive: true,
                          scales: {
                            y: { beginAtZero: true, title: { display: true, text: 'Velocity (m/s)' } },
                            x: { title: { display: true, text: 'Time (seconds)' } }
                          }
                        }}
                      />
                    </ChartWrapper>

                    {/* Scatter Plot */}
                    <ChartWrapper>
                      <h3>Tremor Frequency vs. Amplitude</h3>
                      <Scatter 
                        data={charts.tremorScatterChart}
                        options={{
                          responsive: true,
                          scales: {
                            x: {
                              title: { display: true, text: 'Frequency (Hz)' },
                              min: 0,
                              max: 10
                            },
                            y: {
                              title: { display: true, text: 'Amplitude (Intensity)' },
                              beginAtZero: true
                            }
                          },
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              callbacks: {
                                label: (ctx) => `Freq: ${ctx.parsed.x}Hz, Amp: ${ctx.parsed.y}`
                              }
                            }
                          }
                        }}
                      />
                      <ClinicalZones>
                        <strong>Clinical Interpretation Zones:</strong>
                        <ZoneItem color="#3cff00ff">
                          <strong>Green Zone (0-4 Hz):</strong> Normal Range - typical motor variability seen in healthy individuals during normal movement and posture
                        </ZoneItem>
                        <ZoneItem color="#ffee00ff">
                          <strong>Yellow Zone (4-6 Hz):</strong> Moderate Range - characteristic resting tremor frequency considered normal presentation for Parkinson's disease patients
                        </ZoneItem>
                        <ZoneItem color="#d41313ff">
                          <strong>Red Zone (6-12 Hz):</strong> Severe Range - higher frequency tremors typically observed in patients clinically diagnosed with essential tremor disorders
                        </ZoneItem>
                      </ClinicalZones>
                    </ChartWrapper>
                  </>
                );
              })()}
            </div>
          )}
        </CustomSectionCard>
      ))}

      {/* Other Games */}
      {selectedGame === "hanoi" && !selectedSection && (
        <ChartWrapper>
          <h3>Tower of Hanoi Data</h3>
          <p>Coming soon: move counts, time to completion, error rate.</p>
        </ChartWrapper>
      )}

      {selectedGame === "darts" && !selectedSection && (
        <ChartWrapper>
          <h3>Darts Data</h3>
          <p>Coming soon: accuracy heatmap, average score, bullseye rate.</p>
        </ChartWrapper>
      )}

      {/* Add Section Modal */}
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
              <ModalButton onClick={() => setShowAddModal(false)}>
                Cancel
              </ModalButton>
              <ModalButton primary onClick={addCustomSection}>
                Add Section
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}