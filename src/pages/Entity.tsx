import React from 'react';

const Entity: React.FC = () => {
  const politician = {
    name: "Harka Sampang",
    type: "Person",
    role: "Politician",
    party: "Nepal Communist Party",
    constituency: "Dhankuta-1",
    birthDate: "1975-03-15",
    education: "Master's in Political Science"
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Entity Information</h1>
      <div style={{ marginTop: '20px' }}>
        <p><strong>Name:</strong> {politician.name}</p>
        <p><strong>Type:</strong> {politician.type}</p>
        <p><strong>Role:</strong> {politician.role}</p>
        <p><strong>Political Party:</strong> {politician.party}</p>
        <p><strong>Constituency:</strong> {politician.constituency}</p>
        <p><strong>Birth Date:</strong> {politician.birthDate}</p>
        <p><strong>Education:</strong> {politician.education}</p>
      </div>
    </div>
  );
};

export default Entity;