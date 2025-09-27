import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyles from './GlobalStyles';
import TopBar from './TopBar';
import LandingPage from './LandingPage';
import AboutPage from './AboutPage';
import ProductPage from './ProductPage';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import PatientPage from './PatientPage';

function App() {
  return (
    <Router>
      <GlobalStyles />
      <TopBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/patient/:id" element={<PatientPage />} />
      </Routes>
    </Router>
  );
}

export default App;
