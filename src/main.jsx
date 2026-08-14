import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ContentWindow from './ContentWindow.jsx';
import './index.css';

const view = new URLSearchParams(window.location.search).get('view');
const CONTENT_VIEWS = ['transcript', 'assist', 'checklist', 'script'];

const root = CONTENT_VIEWS.includes(view) ? <ContentWindow view={view} /> : <App />;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {root}
  </React.StrictMode>
);
