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
      case 'hospital':
        return { entity_type: 'organization', sub_type: 'hospital' };
      case 'location':
        return { entity_type: 'location' };
      case 'development_project':
        return { entity_type: 'project', sub_type: 'development_project'};
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
        backgroundColor: 'var(--bg-overlay)',
        backdropFilter: 'blur(2px)',
        marginTop: '10vh',
        minHeight: '100vh',
        transition: 'background-color 0.3s ease',
      }}>
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: 'var(--text-inverse)', transition: 'color 0.3s ease' }}>Welcome to NES Tundikhel</h1>
            <p style={{ color: 'var(--text-inverse)', transition: 'color 0.3s ease' }}>Playground for testing <a href="https://nes.newnepal.org" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--link-color)', textDecoration: 'underline' }}>Nepal Entity Service</a></p>
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
            border: `1px solid var(--input-border)`,
            borderRadius: '4px',
            boxSizing: 'border-box',
            backgroundColor: 'var(--input-bg)',
            color: 'var(--input-text)',
            transition: 'background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease'
          }}
        />
          </div>

          <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {[
              { value: 'person', label: 'Person' },
              { value: 'political_party', label: 'Political Party' },
              { value: 'government_body', label: 'Government Body' },
              { value: 'hospital', label: 'Hospital' },
              { value: 'location', label: 'Administrative Levels (Location)' },
              { value: 'development_project', label: 'Development Projects' }
            ].map(({ value, label }) => (
              <label key={value} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="entityType"
                  value={value}
                  checked={selectedType === value}
                  onChange={(e) => setSelectedType(e.target.value)}
                />
                <span style={{ color: 'var(--text-inverse)' }}>{label}</span>
              </label>
            ))}
          </div>


          {loading && (
            <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap: '10px', margin:'20px 0', color: 'var(--text-inverse)', transition: 'color 0.3s ease' }}>
              <div className="spinner" /> Searching...
            </div>
          )}

           {error && (
              <div style={{
                color: 'var(--error-text)',
                background: 'rgba(255,0,0,0.1)',
                border: '1px solid rgba(255,0,0,0.3)',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '20px'
              }}>
                ❌ Something went wrong, Please try again. <br /> Error: {error}
              </div>
            )}

          {!loading && !error && total === 0 && query.trim() !== '' && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px'
            }}>
              No results found for “{query}”
            </div>
          )}

          {total > 0 && (
            <div style={{ marginBottom: '10px', color: 'var(--text-inverse)', transition: 'color 0.3s ease' }}>
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
                border: `1px solid var(--border-color)`,
                borderRadius: '4px',
                padding: '15px',
                marginBottom: '10px',
                cursor: 'pointer',
                backgroundColor: 'var(--bg-primary)',
                transition: 'background-color 0.2s ease, border-color 0.3s ease'
              }}
            >
              <h3 style={{ margin: '0 0 5px 0', color: 'var(--text-primary)', transition: 'color 0.3s ease' }}>
                {entity.names[0]?.en?.full}
              </h3>
              {entity.names[0]?.ne?.full && (
                <p style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)', transition: 'color 0.3s ease' }}>
                  {entity.names[0].ne.full}
                </p>
              )}
              <p style={{ margin: '0', fontSize: '14px', color: 'var(--text-tertiary)', transition: 'color 0.3s ease' }}>
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