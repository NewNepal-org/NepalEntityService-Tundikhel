import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useEntitySearch } from '../hooks/useEntitySearch';
import { getEntityPath } from '../common/identifiers';
import type { Entity } from '../common/nes-types';

const ENTITY_TYPE_OPTIONS = [
  { value: 'person', label: 'Person' },
  { value: 'political_party', label: 'Political Party' },
  { value: 'government_body', label: 'Government Body' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'ngo', label: 'NGO' },
  { value: 'international_org', label: 'International Organization' },
  { value: 'location', label: 'Administrative Levels (Location)' },
  { value: 'development_project', label: 'Development Projects' }
];

const SearchResultItem = React.memo<{ entity: Entity }>(({ entity }) => (
  <Link
    to={`/entity/${getEntityPath(entity.id)}`}
    style={{ textDecoration: 'none', color: 'inherit' }}
  >
      <div className="search-result-item">
      <h3 className="result-title">
        {entity.names[0]?.en?.full}
      </h3>
      {entity.names[0]?.ne?.full && (
        <p className="result-nepali">
          {entity.names[0].ne.full}
        </p>
      )}
      <p className="result-meta">
        {entity.type}{entity.sub_type ? ` / ${entity.sub_type}` : ''} {entity.attributes?.party && typeof entity.attributes.party === 'string' ? `• ${entity.attributes.party}` : ''}
      </p>
    </div>
  </Link>
));

SearchResultItem.displayName = 'SearchResultItem';

const Home: React.FC = () => {
  const [query, setQuery] = useState('rabi');
  const [selectedType, setSelectedType] = useState('person');
  
  const filters = useMemo(() => {
    switch (selectedType) {
      case 'political_party':
        return { entity_type: 'organization', sub_type: 'political_party' };
      case 'government_body':
        return { entity_type: 'organization', sub_type: 'government_body' };
      case 'hospital':
        return { entity_type: 'organization', sub_type: 'hospital' };
      case 'ngo':
        return { entity_type: 'organization', sub_type: 'ngo' };
      case 'international_org':
        return { entity_type: 'organization', sub_type: 'international_org' };
      case 'location':
        return { entity_type: 'location' };
      case 'development_project':
        return { entity_type: 'project', sub_type: 'development_project'};
      default:
        return { entity_type: 'person' };
    }
  }, [selectedType]);

  const { results, total, loading, error } = useEntitySearch(query, filters);

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh'
    }}>
      <div className="home-bg-fixed"></div>
      <div style={{
        backgroundColor: 'var(--bg-overlay)',
        marginTop: '10vh',
        minHeight: '100vh',
      }}>
        <div className="home-content">
          <div className="home-header">
        <h1 style={{ color: 'var(--text-inverse)' }}>Welcome to NES Tundikhel</h1>
            <p style={{ color: 'var(--text-inverse)' }}>Playground for testing <a href="https://nes.newnepal.org" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--link-color)', textDecoration: 'underline' }}>Nepal Entity Service</a></p>
          </div>

          <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search entities (English or Nepali)..."
          className="search-input"
        />
          </div>

          <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
            <legend style={{ color: 'var(--text-inverse)', marginBottom: '10px', fontWeight: 600 }}>
              Filter by Entity Type:
            </legend>
            <div className="entity-type-options">
              {ENTITY_TYPE_OPTIONS.map(({ value, label }) => (
                <label key={value} className="entity-type-label">
                  <input
                    type="radio"
                    name="entityType"
                    value={value}
                    checked={selectedType === value}
                    onChange={(e) => setSelectedType(e.target.value)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>


          {loading && (
            <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap: '10px', margin:'20px 0', color: 'var(--text-inverse)' }}>
              <div className="spinner" /> Searching...
            </div>
          )}

           {error && (
              <div className="error-box">
                ❌ Something went wrong, Please try again. <br /> Error: {error}
              </div>
            )}

          {!loading && !error && total === 0 && query.trim() !== '' && (
            <div className="no-results">
              No results found for “{query}”
            </div>
          )}

          {total > 0 && (
            <div className="results-count">
              Found {total} result{total !== 1 ? 's' : ''}
            </div>
          )}

          <div>
            {results.map((entity) => (
              <SearchResultItem key={entity.id} entity={entity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;