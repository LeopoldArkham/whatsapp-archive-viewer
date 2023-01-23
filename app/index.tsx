import { createRoot } from 'react-dom/client';
import React from 'react';
import './tailwind.css';

import { App } from './App';

const domRoot = document.getElementById('root');

if (domRoot == null) {
  console.error(
    'Could not mount the application because no element with Id `root` was found'
  );
} else {
  const root = createRoot(domRoot);
  root.render(<App />);
}
