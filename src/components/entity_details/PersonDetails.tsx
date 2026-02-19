import React from 'react';
import type { Person } from '../../common/nes-types';
import EntityName from './EntityName';
import EntityPicture from './EntityPicture';
import LangText from './LangText';
import MarkdownText from './MarkdownText';
import DetailField from './DetailField';
import SectionHeader from './SectionHeader';
import EntityLink from './EntityLink';
import AttributesDisplay from './AttributesDisplay';
import TagsDisplay from './TagsDisplay';

import EducationSection from './EducationSection';
import OccupationalHistorySection from './OccupationalHistorySection';
import { formattedDate } from '../../utils/date';

interface PersonDetailsProps {
  entity: Person;
}

const PersonDetails: React.FC<PersonDetailsProps> = ({ entity }) => {
  const personal = entity.personal_details;
  const electoral = entity.electoral_details;

  const getElectionTypeNepali = (type: string) => {
    const translations: { [key: string]: string } = {
      'federal': 'संघीय',
      'provincial': 'प्रदेश',
      'local': 'स्थानीय',
      'ward': 'वडा'
    };
    return translations[type] || type;
  };

  const getPositionNepali = (position: string) => {
    const translations: { [key: string]: string } = {
      'federal_parliament': 'संघीय संसद',
      'provincial_assembly': 'प्रदेश सभा',
      'mayor': 'मेयर',
      'deputy_mayor': 'उपमेयर',
      'ward_chairperson': 'वडा अध्यक्ष',
      'ward_member': 'वडा सदस्य',
      'dalit_female_member': 'दलित महिला सदस्य',
      'female_member': 'महिला सदस्य'
    };
    return translations[position] || position;
  };

  const getGenderNepali = (gender: string) => {
    const translations: { [key: string]: string } = {
      'male': 'पुरुष',
      'female': 'महिला',
      'other': 'अन्य'
    };
    return translations[gender] || gender;
  };

  return (
    <div>
      <EntityPicture
        pictures={entity.pictures}
        alt={entity.names[0]?.en?.full || 'Person'}
        style={{ marginBottom: '20px' }}
      />

      {entity.tags && entity.tags.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <TagsDisplay tags={entity.tags} />
        </div>
      )}

      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: `1px solid var(--border-color)`,
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: `0 1px 3px var(--shadow)`,
            backgroundColor: 'var(--bg-primary)',
          }}
        >
          <tbody>

            <SectionHeader title="Personal Details / व्यक्तिगत विवरण" />

            <DetailField label="ID" labelNe="आईडी">{entity.id}</DetailField>

            <DetailField label="Name" labelNe="नाम">
              <EntityName names={entity.names} />
            </DetailField>

            <DetailField label="Birth Date" labelNe="जन्म मिति">
              {personal?.birth_date ? `${personal.birth_date} A.D.` : null}
            </DetailField>

            <DetailField label="Birth Place" labelNe="जन्म स्थान">
              {personal?.birth_place?.location_id && (
                <EntityLink entityId={personal.birth_place.location_id}>
                  {personal.birth_place.location_id}
                </EntityLink>
              )}
            </DetailField>

            <DetailField label="Gender" labelNe="लिङ्ग">
              {personal?.gender ? (
                <>
                  {personal.gender}<br />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9em' }}>
                    {getGenderNepali(personal.gender)}
                  </span>
                </>
              ) : null}
            </DetailField>

            <DetailField label="Address" labelNe="ठेगाना">
              {personal?.address?.location_id && (
                <EntityLink entityId={personal.address.location_id}>
                  {personal.address.location_id}
                </EntityLink>
              )}
            </DetailField>

            <DetailField label="Short Description" labelNe="छोटो विवरण">
              {entity.short_description ? (
                <LangText text={entity.short_description} />
              ) : null}
            </DetailField>

            <DetailField label="Description" labelNe="विवरण">
              {entity.description ? (
                <MarkdownText text={entity.description} />
              ) : null}
            </DetailField>

            <EducationSection education={personal?.education} />
            <OccupationalHistorySection positions={personal?.positions} />

            
            <SectionHeader title="Electoral History / निर्वाचन इतिहास" />
            {electoral?.candidacies && electoral.candidacies.length > 0 ? (
              <tr>
                <td colSpan={2} style={{ padding: '16px 20px', backgroundColor: 'var(--bg-primary)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[...electoral.candidacies]
                      .sort((a, b) => b.election_year - a.election_year)
                      .map((candidacy, index) => (
                      <div
                        key={
                          candidacy.candidate_id &&
                          candidacy.election_year &&
                          candidacy.election_type
                            ? `${candidacy.candidate_id}-${candidacy.election_year}-${candidacy.election_type}`
                            : index
                        }
                        style={{
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          padding: '16px',
                          backgroundColor: 'var(--bg-secondary)',
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {/* Header Row */}
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start',
                          paddingBottom: '12px',
                          borderBottom: '1px solid var(--border-color)',
                          marginBottom: '12px',
                          gap: '12px'
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              fontSize: '1.05em', 
                              fontWeight: '600',
                              color: 'var(--text-primary)',
                              marginBottom: '4px'
                            }}>
                              {candidacy.election_year} {candidacy.election_type.charAt(0).toUpperCase() + candidacy.election_type.slice(1)} Election
                            </div>
                            <div style={{ 
                              fontSize: '0.95em', 
                              color: 'var(--text-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              flexWrap: 'wrap'
                            }}>
                              <span style={{ fontWeight: '500' }}>
                                {candidacy.position?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                {candidacy.pa_subdivision && ` (${candidacy.pa_subdivision})`}
                              </span>
                              <span style={{ color: 'var(--text-secondary)' }}>•</span>
                              <span style={{ fontSize: '0.9em', color: 'var(--text-secondary)' }}>
                                {candidacy.position ? getPositionNepali(candidacy.position) : getElectionTypeNepali(candidacy.election_type)}
                              </span>
                            </div>
                          </div>
                          {candidacy.elected !== null && candidacy.elected !== undefined && (
                            <span style={{
                              backgroundColor: candidacy.elected ? 'var(--success-bg)' : 'var(--bg-tertiary)',
                              color: candidacy.elected ? 'var(--success-text)' : 'var(--text-primary)',
                              padding: '6px 14px',
                              borderRadius: '16px',
                              fontSize: '0.85em',
                              fontWeight: '600',
                              whiteSpace: 'nowrap',
                              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                            }}>
                              {candidacy.elected ? '✓ Elected' : 'Not Elected'}
                            </span>
                          )}
                        </div>
                        
                        {/* Details Grid */}
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                          gap: '12px',
                          fontSize: '0.9em'
                        }}>
                          {candidacy.constituency_id && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{ fontSize: '0.85em', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                Constituency <span style={{ fontSize: '0.95em' }}>/ निर्वाचन क्षेत्र</span>
                              </span>
                              <span style={{ color: 'var(--text-primary)' }}>
                                {candidacy.constituency_id.startsWith('entity:') ? (
                                  <EntityLink entityId={candidacy.constituency_id}>
                                    {candidacy.constituency_id.split('/').pop()?.replace(/-/g, ' ')}
                                  </EntityLink>
                                ) : (
                                  candidacy.constituency_id
                                )}
                              </span>
                            </div>
                          )}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontSize: '0.85em', color: 'var(--text-secondary)', fontWeight: '500' }}>
                              Political Party <span style={{ fontSize: '0.95em' }}>/ राजनीतिक दल</span>
                            </span>
                            <span style={{ color: 'var(--text-primary)' }}>
                              {candidacy.party_id ? (
                                candidacy.party_id.startsWith('entity:') ? (
                                  <EntityLink entityId={candidacy.party_id}>
                                    {candidacy.party_id.split('/').pop()?.replace(/-/g, ' ')}
                                  </EntityLink>
                                ) : (
                                  candidacy.party_id
                                )
                              ) : (
                                <em style={{ color: 'var(--text-secondary)' }}>Independent / स्वतन्त्र</em>
                              )}
                            </span>
                          </div>
                          {candidacy.votes_received !== null && candidacy.votes_received !== undefined && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{ fontSize: '0.85em', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                Votes Received <span style={{ fontSize: '0.95em' }}>/ प्राप्त मत</span>
                              </span>
                              <span style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '1.05em' }}>
                                {candidacy.votes_received.toLocaleString()}
                              </span>
                            </div>
                          )}
                          {candidacy.symbol?.symbol_name && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{ fontSize: '0.85em', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                Election Symbol <span style={{ fontSize: '0.95em' }}>/ चुनाव चिन्ह</span>
                              </span>
                              <span style={{ color: 'var(--text-primary)' }}>
                                <LangText text={candidacy.symbol.symbol_name} />
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Footer with Candidate ID */}
                        <div style={{ 
                          marginTop: '12px',
                          paddingTop: '12px',
                          borderTop: '1px solid var(--border-color)',
                          fontSize: '0.8em',
                          color: 'var(--text-secondary)'
                        }}>
                          Candidate ID / उम्मेदवार आईडी: {candidacy.candidate_id}
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ) : (
              <DetailField label="Electoral History"><em>No electoral candidacy records found</em></DetailField>
            )}

            
            {entity.attributes && (
              <>
                <SectionHeader title="Attributes / विशेषताहरू" />
                <tr>
                  <td colSpan={2} style={{ padding: '16px 20px', backgroundColor: 'var(--bg-primary)' }}>
                    <AttributesDisplay attributes={entity.attributes} />
                  </td>
                </tr>
              </>
            )}

          
            {entity.attributions && entity.attributions.length > 0 && (
              <>
                <SectionHeader title="Attributions / स्रोतहरू" />
                <tr>
                  <td colSpan={2} style={{ padding: '16px 20px', backgroundColor: 'var(--bg-primary)' }}>
                    <div>
                      {entity.attributions.map((attr, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                          <strong>
                            {attr.title.en?.value || attr.title.ne?.value}
                          </strong>
                          {attr.details && (
                            <div style={{ fontSize: '0.9em', color: 'var(--text-secondary)' }}>
                              {attr.details.en?.value || attr.details.ne?.value}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              </>
            )}

          
            <SectionHeader title="System Information / प्रणाली जानकारी" />

            <tr>
              <td colSpan={2} style={{ padding: '16px' }}>
                <details aria-label="Version and audit information">
                  <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
                    View Version & Audit Details / संस्करण र लेखापरीक्षण विवरण हेर्नुहोस्
                  </summary>

                  <table style={{ marginTop: '12px', width: '100%' }}>
                    <tbody>
                      <DetailField label="Slug" labelNe="स्लग">
                        {entity.slug}
                      </DetailField>

                      <DetailField label="Version Number" labelNe="संस्करण नम्बर">
                        {entity.version_summary?.version_number}
                      </DetailField>

                      <DetailField label="Version Author" labelNe="संस्करण लेखक">
                        {entity.version_summary?.author?.name ||
                          entity.version_summary?.author?.slug}
                      </DetailField>

                      <DetailField label="Change Description" labelNe="परिवर्तन विवरण">
                        {entity.version_summary?.change_description}
                      </DetailField>

                      <DetailField label="Last Modified" labelNe="अन्तिम परिमार्जन">
                        {entity.version_summary?.created_at
                          ? formattedDate(new Date(entity.version_summary.created_at))
                          : null}
                      </DetailField>

                      <DetailField label="Created At" labelNe="सिर्जना मिति">
                        {entity.created_at
                          ? formattedDate(new Date(entity.created_at))
                          : null}
                      </DetailField>
                    </tbody>
                  </table>
                </details>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PersonDetails;