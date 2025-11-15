import React from 'react';
import type { Person } from '../../common/nes-types';
import EntityName from './EntityName';
import EntityPicture from './EntityPicture';
import LangText from './LangText';
import MarkdownText from './MarkdownText';
import DetailField from './DetailField';
import SectionHeader from './SectionHeader';

import EducationSection from './EducationSection';
import OccupationalHistorySection from './OccupationalHistorySection';

interface PersonDetailsProps {
  entity: Person;
}

const PersonDetails: React.FC<PersonDetailsProps> = ({ entity }) => {
  const personal = entity.personal_details;
  const electoral = entity.electoral_details;
  const candidacy = electoral?.candidacies?.[0];
  
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
      
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
        <tbody>
          <SectionHeader title="Personal Details" />
          <DetailField label="ID" labelNe="आईडी">{entity.id}</DetailField>
          <DetailField label="Name" labelNe="नाम"><EntityName names={entity.names} /></DetailField>
          <DetailField label="Birth Date" labelNe="जन्म मिति">{personal?.birth_date ? `${personal.birth_date} A.D.` : null}</DetailField>
          <DetailField label="Birth Place" labelNe="जन्म स्थान">{personal?.birth_place?.description2 ? <LangText text={personal.birth_place.description2} /> : <em>Unknown</em>}</DetailField>
          <DetailField label="Citizenship Place" labelNe="नागरिकता स्थान">{personal?.citizenship_place?.description2 ? <LangText text={personal.citizenship_place.description2} /> : <em>Unknown</em>}</DetailField>
          <DetailField label="Gender" labelNe="लिङ्ग">
            {personal?.gender ? (
              <>
                {personal.gender}<br />
                <span style={{ color: '#666', fontSize: '0.9em' }}>
                  {getGenderNepali(personal.gender)}
                </span>
              </>
            ) : null}
          </DetailField>
          <DetailField label="Address" labelNe="ठेगाना">{personal?.address?.description2 ? <LangText text={personal.address.description2} /> : null}</DetailField>
          <DetailField label="Father's Name" labelNe="बुबाको नाम">{personal?.father_name ? <LangText text={personal.father_name} /> : null}</DetailField>
          <DetailField label="Mother's Name" labelNe="आमाको नाम">{personal?.mother_name ? <LangText text={personal.mother_name} /> : <em>Unknown</em>}</DetailField>
          <DetailField label="Spouse's Name" labelNe="पति/पत्नीको नाम">{personal?.spouse_name ? <LangText text={personal.spouse_name} /> : null}</DetailField>
          <DetailField label="Short Description" labelNe="छोटो विवरण">{entity.short_description ? <LangText text={entity.short_description} /> : null}</DetailField>
          <DetailField label="Description" labelNe="विवरण">{entity.description ? <MarkdownText text={entity.description} /> : null}</DetailField>
          
          <EducationSection education={personal?.education} />
          <OccupationalHistorySection positions={personal?.positions} />
          
          <SectionHeader title="Electoral History" />
          <DetailField label="Election Year" labelNe="चुनाव वर्ष">{candidacy?.election_year}</DetailField>
          <DetailField label="Election Type & Position" labelNe="चुनाव प्रकार र पद">
            {candidacy?.election_type && candidacy?.position ? (
              candidacy.election_type === 'federal' || candidacy.election_type === 'provincial' ? (
                <>
                  {candidacy.position}{candidacy.pa_subdivision ? ` (${candidacy.pa_subdivision})` : ''}<br />
                  <span style={{ color: '#666', fontSize: '0.9em' }}>
                    {getPositionNepali(candidacy.position)}
                  </span>
                </>
              ) : (
                <>
                  {candidacy.election_type} - {candidacy.position}<br />
                  <span style={{ color: '#666', fontSize: '0.9em' }}>
                    {getElectionTypeNepali(candidacy.election_type)} - {getPositionNepali(candidacy.position)}
                  </span>
                </>
              )
            ) : (
              candidacy?.election_type || candidacy?.position
            )}
          </DetailField>
          <DetailField label="Constituency ID" labelNe="निर्वाचन क्षेत्र आईडी">{candidacy?.constituency_id}</DetailField>

          <DetailField label="Candidate ID" labelNe="उम्मेदवार आईडी">{candidacy?.candidate_id}</DetailField>
          <DetailField label="Party ID" labelNe="पार्टी आईडी">{candidacy?.party_id}</DetailField>
          <DetailField label="Votes Received" labelNe="प्राप्त मत">{candidacy?.votes_received?.toLocaleString()}</DetailField>
          <DetailField label="Elected" labelNe="निर्वाचित">
            {candidacy?.elected !== undefined ? (
              <span style={{
                backgroundColor: candidacy.elected ? '#d4edda' : '#f8d7da',
                color: candidacy.elected ? '#155724' : '#721c24',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.85em',
                fontWeight: 'bold'
              }}>
                {candidacy.elected ? 'Yes' : 'No'}
              </span>
            ) : null}
          </DetailField>
          <DetailField label="Election Symbol" labelNe="चुनाव चिन्ह">{candidacy?.symbol?.symbol_name ? <LangText text={candidacy.symbol.symbol_name} /> : null}</DetailField>

          
          <SectionHeader title="Miscellaneous" />
          <DetailField label="Slug" labelNe="स्लग">{entity.slug}</DetailField>
          <DetailField label="Version Number" labelNe="संस्करण नम्बर">{entity.version_summary.version_number}</DetailField>
          <DetailField label="Version Author" labelNe="संस्करण लेखक">{entity.version_summary.author.name || entity.version_summary.author.slug}</DetailField>
          <DetailField label="Change Description" labelNe="परिवर्तन विवरण">{entity.version_summary.change_description}</DetailField>
          <DetailField label="Last Modified" labelNe="अन्तिम परिमार्जन">{entity.version_summary.created_at}</DetailField>
          <DetailField label="Created At" labelNe="सिर्जना मिति">{entity.created_at}</DetailField>
          <DetailField label="Tags" labelNe="ट्यागहरू">{entity.tags?.join(', ')}</DetailField>
          <DetailField label="Attributes" labelNe="विशेषताहरू">
            {entity.attributes ? (
              <pre style={{ fontSize: '0.85em', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(entity.attributes, null, 2)}
              </pre>
            ) : null}
          </DetailField>
          <DetailField label="Attributions" labelNe="स्रोतहरू">
            {entity.attributions?.length ? (
              <div>
                {entity.attributions.map((attr, index) => (
                  <div key={index} style={{ marginBottom: '8px' }}>
                    <strong>
                      {attr.title.en?.value || attr.title.ne?.value}
                      {attr.title.en?.value && attr.title.ne?.value && (
                        <><br /><span style={{ color: '#666', fontSize: '0.9em', fontWeight: 'normal' }}>{attr.title.ne.value}</span></>
                      )}
                    </strong>
                    {attr.details && (
                      <div style={{ fontSize: '0.9em', color: '#666' }}>
                        {attr.details.en?.value || attr.details.ne?.value}
                        {attr.details.en?.value && attr.details.ne?.value && (
                          <><br /><span style={{ fontSize: '0.85em' }}>{attr.details.ne.value}</span></>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : null}
          </DetailField>
        </tbody>
      </table>
    </div>
  );
};

export default PersonDetails;