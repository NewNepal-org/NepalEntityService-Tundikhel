import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Entity from './pages/Entity';
import EnvironmentSwitcher from './components/EnvironmentSwitcher';
import './App.css'

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div>
          <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: '15px 30px', backgroundColor: '#2563eb', color: 'white', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', cursor: 'pointer' }}>Tundikhel</h1>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div>
                <Link to="/" style={{ marginRight: '15px', textDecoration: 'none' }}>
                  <button style={{ padding: '8px 16px', backgroundColor: 'transparent', color: 'white', border: '1px solid white', borderRadius: '4px', cursor: 'pointer' }}>Home</button>
                </Link>
                {/* <Link to="/entity" style={{ textDecoration: 'none' }}>
                  <button style={{ padding: '8px 16px', backgroundColor: 'transparent', color: 'white', border: '1px solid white', borderRadius: '4px', cursor: 'pointer' }}>Entity</button>
                </Link> */}
              </div>
              <EnvironmentSwitcher />
            </div>
          </nav>
          
          <div style={{ marginTop: '80px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/entity" element={<Entity />} />
              <Route path="/entity/*" element={<Entity />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App
