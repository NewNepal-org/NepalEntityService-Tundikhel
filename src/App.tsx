import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Entity from './pages/Entity';
import './App.css'

function App() {
  return (
    <Router>
      <div>
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: '15px 30px', backgroundColor: '#2563eb', color: 'white', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Tundikhel</h1>
          <div>
            <Link to="/" style={{ marginRight: '15px', textDecoration: 'none' }}>
              <button style={{ padding: '8px 16px', backgroundColor: 'transparent', color: 'white', border: '1px solid white', borderRadius: '4px', cursor: 'pointer' }}>Home</button>
            </Link>
            <Link to="/entity" style={{ textDecoration: 'none' }}>
              <button style={{ padding: '8px 16px', backgroundColor: 'transparent', color: 'white', border: '1px solid white', borderRadius: '4px', cursor: 'pointer' }}>Entity</button>
            </Link>
          </div>
        </nav>
        
        <div style={{ marginTop: '80px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/entity" element={<Entity />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
