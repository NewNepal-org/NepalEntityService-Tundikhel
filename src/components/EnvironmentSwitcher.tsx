import { useState } from 'react';
import { ENVIRONMENTS, getCurrentEnvironment, setCurrentEnvironment } from '../config/environment';

function EnvironmentSwitcher() {
  const [currentEnv, setCurrentEnv] = useState(getCurrentEnvironment());

  const switchEnvironment = (env: string) => {
    setCurrentEnvironment(env);
    setCurrentEnv(env);
    window.location.reload();
  };

  const environment = ENVIRONMENTS[currentEnv];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '14px' }}>API:</span>
      <select 
        value={currentEnv} 
        onChange={(e) => switchEnvironment(e.target.value)}
        style={{
          padding: '4px 8px',
          backgroundColor: environment.color,
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        {Object.entries(ENVIRONMENTS).map(([key, env]) => (
          <option key={key} value={key} style={{ color: 'black' }}>
            {env.name}
          </option>
        ))}
      </select>
      {currentEnv === 'LOCAL' && (
        <span style={{ fontSize: '12px', color: '#dc2626' }}>⚠️ DEV</span>
      )}
    </div>
  );
}

export default EnvironmentSwitcher;