# Environment Configuration

## Tundikhel as NES Playground

Tundikhel serves as a **testing playground** for the Nepal Entity Service (NES), allowing developers and users to:

- Test API functionality against different environments
- Compare data between production and local development instances
- Validate new features before production deployment
- Demonstrate NES capabilities to stakeholders

## Environment Switching

### Supported Environments

1. **Production Environment**
   - Base URL: `https://nes.newnepal.org`
   - Full API URL: `https://nes.newnepal.org/api`
   - Live, stable data
   - Rate limiting enforced

2. **Local Development Environment**
   - Base URL: `http://localhost:5173`
   - Full API URL: `http://localhost:5173/api`
   - Development/testing data
   - No rate limiting (typically)

### Implementation

#### Environment Configuration

```javascript
// config/environment.js
export const ENVIRONMENTS = {
  PRODUCTION: {
    name: 'Production',
    baseUrl: 'https://nes.newnepal.org',
    color: '#2563eb', // Blue
    description: 'Live NES instance with stable data'
  },
  LOCAL: {
    name: 'Local Development',
    baseUrl: 'http://localhost:5173',
    color: '#dc2626', // Red
    description: 'Local NES instance for development and testing'
  }
};

export const API_PATH = '/api';

export const getCurrentEnvironment = () => {
  const saved = localStorage.getItem('nes_tundikhel_environment');
  return saved && ENVIRONMENTS[saved] ? saved : 'PRODUCTION';
};

export const setCurrentEnvironment = (env) => {
  if (ENVIRONMENTS[env]) {
    localStorage.setItem('nes_tundikhel_environment', env);
  }
};

export const getApiUrl = () => {
  const env = getCurrentEnvironment();
  return `${ENVIRONMENTS[env].baseUrl}${API_PATH}`;
};
```

#### Environment Context Provider

```javascript
// contexts/EnvironmentContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentEnvironment, setCurrentEnvironment, ENVIRONMENTS } from '../config/environment';

const EnvironmentContext = createContext();

export function EnvironmentProvider({ children }) {
  const [currentEnv, setCurrentEnv] = useState(getCurrentEnvironment());

  const switchEnvironment = (env) => {
    if (ENVIRONMENTS[env]) {
      setCurrentEnvironment(env);
      setCurrentEnv(env);
      // Optionally reload to clear any cached data
      window.location.reload();
    }
  };

  const value = {
    currentEnv,
    environment: ENVIRONMENTS[currentEnv],
    switchEnvironment,
    isLocal: currentEnv === 'LOCAL',
    isProduction: currentEnv === 'PRODUCTION'
  };

  return (
    <EnvironmentContext.Provider value={value}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export const useEnvironment = () => {
  const context = useContext(EnvironmentContext);
  if (!context) {
    throw new Error('useEnvironment must be used within EnvironmentProvider');
  }
  return context;
};
```

#### Environment Switcher Component

```javascript
// components/EnvironmentSwitcher.js
import React from 'react';
import { useEnvironment } from '../contexts/EnvironmentContext';
import { ENVIRONMENTS } from '../config/environment';

function EnvironmentSwitcher() {
  const { currentEnv, environment, switchEnvironment, isLocal } = useEnvironment();

  return (
    <div className={`environment-switcher ${currentEnv.toLowerCase()}`}>
      <div className="env-indicator" style={{ backgroundColor: environment.color }}>
        <span className="env-label">API:</span>
        <select 
          value={currentEnv} 
          onChange={(e) => switchEnvironment(e.target.value)}
          className="env-select"
        >
          {Object.entries(ENVIRONMENTS).map(([key, env]) => (
            <option key={key} value={key}>
              {env.name}
            </option>
          ))}
        </select>
        {isLocal && (
          <span className="warning-badge" title="Using local development environment">
            ⚠️ DEV
          </span>
        )}
      </div>
      <div className="env-description">
        {environment.description}
      </div>
    </div>
  );
}

export default EnvironmentSwitcher;
```

#### Updated API Client

```javascript
// services/apiClient.js
import { getApiUrl } from '../config/environment';

class NESApiClient {
  constructor() {
    this.requestCount = { minute: 0, hour: 0 };
    this.resetCounters();
  }

  get baseUrl() {
    return getApiUrl(); // Dynamic URL based on current environment
  }

  async request(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    // Add environment info to request headers for debugging
    const headers = {
      'Accept': 'application/json',
      'X-Tundikhel-Environment': getCurrentEnvironment()
    };

    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    try {
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed [${getCurrentEnvironment()}]:`, error);
      throw error;
    }
  }

  // ... rest of the API methods
}

export default new NESApiClient();
```

### UI Integration

#### Navigation Bar Integration

```javascript
// components/Navigation.js
import EnvironmentSwitcher from './EnvironmentSwitcher';

function Navigation() {
  return (
    <nav className="main-navigation">
      <div className="nav-left">
        <h1>Tundikhel</h1>
      </div>
      <div className="nav-center">
        {/* Navigation links */}
      </div>
      <div className="nav-right">
        <EnvironmentSwitcher />
      </div>
    </nav>
  );
}
```

#### Environment-Aware Styling

```css
/* styles/environment.css */
.environment-switcher {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 0.875rem;
}

.env-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  color: white;
}

.env-select {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 0.25rem;
  padding: 0.125rem 0.25rem;
}

.warning-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.env-description {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

/* Environment-specific body classes */
body.env-production {
  --env-color: #2563eb;
}

body.env-local {
  --env-color: #dc2626;
  border-top: 3px solid var(--env-color);
}

body.env-local::before {
  content: "🚧 DEVELOPMENT ENVIRONMENT";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--env-color);
  color: white;
  text-align: center;
  padding: 0.25rem;
  font-size: 0.75rem;
  z-index: 9999;
}
```

### Testing and Validation

#### Environment Detection Hook

```javascript
// hooks/useEnvironmentValidation.js
import { useState, useEffect } from 'react';
import { useEnvironment } from '../contexts/EnvironmentContext';
import apiClient from '../services/apiClient';

export function useEnvironmentValidation() {
  const { currentEnv } = useEnvironment();
  const [isValid, setIsValid] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const validateEnvironment = async () => {
      try {
        setError(null);
        await apiClient.request('/health');
        setIsValid(true);
      } catch (err) {
        setIsValid(false);
        setError(err.message);
      }
    };

    validateEnvironment();
  }, [currentEnv]);

  return { isValid, error };
}
```

#### Environment Status Component

```javascript
// components/EnvironmentStatus.js
import React from 'react';
import { useEnvironmentValidation } from '../hooks/useEnvironmentValidation';
import { useEnvironment } from '../contexts/EnvironmentContext';

function EnvironmentStatus() {
  const { environment } = useEnvironment();
  const { isValid, error } = useEnvironmentValidation();

  if (isValid === null) {
    return <div className="env-status checking">Checking API...</div>;
  }

  if (isValid) {
    return (
      <div className="env-status success">
        ✅ Connected to {environment.name}
      </div>
    );
  }

  return (
    <div className="env-status error">
      ❌ Cannot connect to {environment.name}
      {error && <div className="error-detail">{error}</div>}
    </div>
  );
}

export default EnvironmentStatus;
```

This configuration allows Tundikhel to serve as an effective playground for testing the Nepal Entity Service across different environments while providing clear visual indicators and validation of the current environment state.