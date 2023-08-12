import './App.css';
import LoginPage from './components/LoginPage';
import BotPlayLanding from './components/BotPlayLanding';
import MultiplayerLanding from './components/MultiplayerLanding';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/MultiplayerLanding' element={<MultiplayerLanding />} />
          <Route path='/BotPlayLanding' element={<BotPlayLanding />} />
          <Route path='/' element={<LoginPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
