import { createRoot } from 'react-dom/client';
import React from 'react';
import './tailwind.css';

import App from './App';

const domRoot = document.getElementById('root');
const root = createRoot(domRoot);
root.render(<App />);
