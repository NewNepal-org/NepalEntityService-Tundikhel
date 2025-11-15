import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEntitySearch } from '../hooks/useEntitySearch';
import { getEntityPath } from '../common/identifiers';

const Home: React.FC = () => {
  const [query, setQuery] = useState('rabi');
  const [selectedType, setSelectedType] = useState('person');
  const getFilters = () => {
    switch (selectedType) {
      case 'political_party':
        return { entity_type: 'organization', sub_type: 'political_party' };
      case 'government_body':
        return { entity_type: 'organization', sub_type: 'government_body' };
      case 'location':
        return { entity_type: 'location' };
      default:
        return { entity_type: 'person' };
    }
  };
  
  const { results, total, loading, error } = useEntitySearch(query, getFilters());

  return (
    <div style={{ 
      position: 'relative',
      minHeight: '100vh'
    }}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url(/tudikhel-flag.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(2px)',
        zIndex: -1
      }}></div>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        marginTop: '20vh',
        minHeight: '100vh'
      }}>
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>Welcome to NES Tundikhel</h1>
            <p>Playground for testing <a href="https://nes.newnepal.org" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'underline' }}>Nepal Entity Service</a></p>
          </div>

          <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search entities (English or Nepali)..."
          style={{
            width: 'calc(100% - 24px)',
            padding: '12px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box'
          }}
        />
          </div>

          <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {[
              { value: 'person', label: 'Person' },
              { value: 'political_party', label: 'Political Party' },
              { value: 'government_body', label: 'Government Body' },
              { value: 'location', label: 'Administrative Levels (Location)' }
            ].map(({ value, label }) => (
              <label key={value} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="entityType"
                  value={value}
                  checked={selectedType === value}
                  onChange={(e) => setSelectedType(e.target.value)}
                />
                {label}
              </label>
            ))}
          </div>

          {loading && <div>Searching...</div>}
          {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      
          {total > 0 && (
            <div style={{ marginBottom: '10px' }}>
              Found {total} result{total !== 1 ? 's' : ''}
            </div>
          )}

          <div>
        {results.map((entity) => (
          <Link
            key={entity.id}
            to={`/entity/${getEntityPath(entity.id)}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
              className="search-result-item"
              style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '15px',
                marginBottom: '10px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              <h3 style={{ margin: '0 0 5px 0' }}>
                {entity.names[0]?.en?.full}
              </h3>
              {entity.names[0]?.ne?.full && (
                <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                  {entity.names[0].ne.full}
                </p>
              )}
              <p style={{ margin: '0', fontSize: '14px', color: '#888' }}>
                {entity.type}{entity.sub_type ? ` / ${entity.sub_type}` : ''} {entity.attributes?.party && typeof entity.attributes.party === 'string' ? `• ${entity.attributes.party}` : ''}
              </p>
            </div>
          </Link>
        ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;