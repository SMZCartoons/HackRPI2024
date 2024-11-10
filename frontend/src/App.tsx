import './App.css';
import { BrowserRouter as Router, Routes, Route, useParams} from 'react-router-dom';
import Home from './pages/home';
import Header from './components/header';
import Footer from './components/footer';
import Login from './components/login';
import ParkingMap from './components/map';

function App() {
  return (
    <div className="page-container">
      <Header/>
      <Router>
        <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/parking-map" element={<ParkingMap />} />
        </Routes>
      </Router>
      <Footer/>
    </div>
  );
}

export default App;
