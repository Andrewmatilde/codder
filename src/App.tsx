import React from 'react';
import './App.css';
import DataListPage from './components/DataListPage';

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="header-title">Data Dashboard</h1>
        </div>
      </header>
      <main>
        <DataListPage />
      </main>
    </div>
  );
}

export default App;
