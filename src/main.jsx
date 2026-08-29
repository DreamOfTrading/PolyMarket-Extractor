import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { seedResolvedSignalsIfEmpty } from './engine/seedData.js';
seedResolvedSignalsIfEmpty(220);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

