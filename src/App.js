import './App.css';
import { useEffect } from 'react';
import LoginPage from './components/LoginPage';
import BotPlayLanding from './components/BotPlayLanding';
import MultiplayerLanding from './components/MultiplayerLanding';
import BotPlay from './components/BotPlay';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Multiplayer from './components/Multiplayer';

function App() {
  useEffect(() => {
    console.log('app mounted');

    return () => {
      console.log('app unmounted');
    }
  }, []);
  return (
    <>
      <Router>
        <Routes>
          <Route path='/MultiplayerLanding' element={<MultiplayerLanding />} />
          <Route path='/BotPlayLanding' element={<BotPlayLanding />} />
          <Route path='/' element={<LoginPage />} />
          <Route path='/BotPlay' element={<BotPlay />} />
          <Route path='/Multiplayer' element={<Multiplayer />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
