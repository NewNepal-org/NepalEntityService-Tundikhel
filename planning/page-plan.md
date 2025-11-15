# Tundikhel Frontend - Page Plan

## Overview

Tundikhel is a **playground frontend application** designed to test and demonstrate the Nepal Entity Service (NES) API. It provides an intuitive interface for exploring Nepali public entities including politicians, political parties, government organizations, and administrative locations.

**Purpose**: Testing ground for Nepal Entity Service functionality and API integration patterns.

**Configurable API Endpoints**:
- Production: `https://nes.newnepal.org`
- Local Development: `http://localhost:5173`
- API path is always appended as `/api`

## Pages

### 1. Home Page (`/`)
**Purpose**: Main interface with integrated search functionality

**Features**:
- Welcome message: "Welcome to NES Tundikhel"
- Integrated search component (supports English and Nepali)
- Filter by entity type (person, organization, location)
- Filter by subtype (political_party, government_body, etc.)
- Search results with pagination
- Featured entities or recent updates

**API Calls**:
- `GET /api/entities?query={search}&entity_type={type}&sub_type={subtype}&limit={limit}&offset={offset}`

### 2. Entity Detail Page (`/entity/:id`)
**Purpose**: Display comprehensive information about a specific entity

**Features**:
- Entity basic information (names, type, attributes)
- Multilingual names (English and Nepali)
- External identifiers and links
- Entity relationships
- Version history
- Contact information (if available)

**API Calls**:
- `GET /api/entities/{id}`
- `GET /api/entities/{id}/relationships`
- `GET /api/entities/{id}/versions`

### 3. Political Parties Page (`/parties`)
**Purpose**: Explore political parties and their members

**Features**:
- List of all political parties
- Party details (founding date, ideology, symbol)
- Member count for each party
- Party member listings

**API Calls**:
- `GET /api/entities?entity_type=organization&sub_type=political_party`
- `GET /api/relationships?relationship_type=MEMBER_OF&target_entity_id={party_id}`

### 4. About Page (`/about`)
**Purpose**: Information about the service and data

**Content**:
- About Nepal Entity Service
- Data sources and methodology
- API information
- Contact and contribution information

## Environment Configuration

### API Base URL Switching
**Purpose**: Allow testing against both production and local NES instances

**Implementation**:
- Environment toggle in UI (Production/Local)
- Base URLs:
  - Production: `https://nes.newnepal.org`
  - Local: `http://localhost:5173`
- API path automatically appended: `/api`
- Settings persisted in localStorage
- Visual indicator of current environment

**Features**:
- Environment switcher in navigation bar
- Different styling/colors for local vs production
- Warning messages when using local environment
- Automatic fallback handling

## Technical Implementation Notes

### State Management
- Use React Context or Redux for global state
- Cache API responses to reduce requests
- Implement loading states and error handling

### Search and Filtering (Home Page)
- Debounced search input
- URL-based state for shareable links
- Advanced filtering options
- Search history
- Integrated results display

### Multilingual Support
- Display both English and Nepali names
- Language toggle functionality
- Proper Devanagari font rendering
- Cultural context preservation

### Performance Optimization
- Pagination for large datasets
- Lazy loading for entity details
- Image optimization for entity photos
- API response caching

### Error Handling
- Graceful handling of API errors
- Offline state detection
- Retry mechanisms for failed requests
- User-friendly error messages

## API Integration Strategy

### Rate Limiting Compliance
- Respect API rate limits (100 req/min, 1000 req/hour)
- Implement request queuing if needed
- Cache responses appropriately
- Show rate limit status to users

### Data Freshness
- Implement cache invalidation strategies
- Show data freshness indicators
- Allow manual refresh options
- Handle stale data gracefully

### CORS and Security
- Leverage CORS support for direct API calls
- Implement proper error boundaries
- Sanitize user inputs
- Secure external link handling

## User Experience Considerations

### Navigation
- Clear breadcrumb navigation
- Consistent header with search
- Mobile-responsive design
- Keyboard navigation support

### Accessibility
- Screen reader compatibility
- High contrast mode support
- Keyboard-only navigation
- Alt text for images and icons

### Cultural Sensitivity
- Proper Nepali name display
- Cultural context in descriptions
- Respectful representation of entities
- Authentic Nepali examples and references