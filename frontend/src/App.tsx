import './App.css';
import { BrowserRouter as Router, Routes, Route, useParams} from 'react-router-dom';
import Home from './pages/home';
import Header from './components/header';
import Footer from './components/footer';

function App() {
  return (
    <div className="page-container">
      <Header/>
      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          {/* <Route path="/about" element={<About />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/voting" element={<Voting />} />
          <Route path="/voting-statistics" element={<VotingStatistics />} />
          <Route path="/glump" element={<Glump />} />
          <Route path="/admin" element={<Admin />}></Route> */}
          <Route path="*" element={<Home />}></Route>
        </Routes>
      </Router>
      <Footer/>
    </div>
  );
}

export default App;
