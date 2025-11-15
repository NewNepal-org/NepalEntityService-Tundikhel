import { useState } from 'react';
import { ENVIRONMENTS, getCurrentEnvironment, setCurrentEnvironment } from '../config/environment';

function EnvironmentSwitcher() {
  const [currentEnv, setCurrentEnv] = useState(getCurrentEnvironment());

  const toggleEnvironment = () => {
    const newEnv = currentEnv === 'PRODUCTION' ? 'LOCAL' : 'PRODUCTION';
    setCurrentEnvironment(newEnv);
    setCurrentEnv(newEnv);
    window.location.reload();
  };

  const isLocal = currentEnv === 'LOCAL';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px' }}>API:</span>
        <button
          onClick={toggleEnvironment}
          style={{
            padding: '8px 16px',
            backgroundColor: isLocal ? '#dc2626' : '#2563eb',
            color: 'white',
            border: '1px solid white',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => (e.target as HTMLButtonElement).style.opacity = '0.9'}
          onMouseOut={(e) => (e.target as HTMLButtonElement).style.opacity = '1'}
        >
          {isLocal ? 'LOCAL' : 'PROD'}
        </button>
        {isLocal && (
          <span style={{ fontSize: '12px', color: '#dc2626' }}>⚠️ DEV</span>
        )}
      </div>
      <div style={{ fontSize: '10px', color: '#e5e7eb', opacity: 0.8 }}>
        {ENVIRONMENTS[currentEnv].baseUrl}
      </div>
    </div>
  );
}

export default EnvironmentSwitcher;