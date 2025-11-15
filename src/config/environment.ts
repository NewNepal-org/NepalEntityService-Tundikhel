interface Environment {
  name: string;
  baseUrl: string;
  color: string;
}

export const ENVIRONMENTS: Record<string, Environment> = {
  PRODUCTION: {
    name: 'Production',
    baseUrl: 'https://nes.newnepal.org',
    color: '#2563eb'
  },
  LOCAL: {
    name: 'Local Development',
    baseUrl: 'http://localhost:8195',
    color: '#dc2626'
  }
};

export const API_PATH = '/api';

export const getCurrentEnvironment = (): string => {
  try {
    const saved = localStorage.getItem('nes_tundikhel_environment');
    return saved && ENVIRONMENTS[saved] ? saved : 'PRODUCTION';
  } catch {
    return 'PRODUCTION';
  }
};

export const setCurrentEnvironment = (env: string): void => {
  if (ENVIRONMENTS[env]) {
    localStorage.setItem('nes_tundikhel_environment', env);
  }
};

export const getApiUrl = (): string => {
  const env = getCurrentEnvironment();
  return `${ENVIRONMENTS[env].baseUrl}${API_PATH}`;
};