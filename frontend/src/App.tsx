import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RoutesConfig from './routes';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <RoutesConfig />
    </Router>
  );
};

export default App;