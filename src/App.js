import './App.css';
import Header from './components/Header/Header'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupLogin from './pages/SignupLogin';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupLogin/>}/>
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </Router>
  );
}

export default App;
