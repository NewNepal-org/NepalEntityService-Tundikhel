import React from 'react';
import type { Location } from '../../common/nes-types';
import EntityName from './EntityName';
import EntityPicture from './EntityPicture';
import LangText from './LangText';
import MarkdownText from './MarkdownText';
import DetailField from './DetailField';
import SectionHeader from './SectionHeader';
import EntityLink from './EntityLink';
import AttributesDisplay from './AttributesDisplay';
import TagsDisplay from './TagsDisplay';
import { formattedDate } from '../../utils/date';

interface LocationDetailsProps {
  entity: Location;
}

const LocationDetails: React.FC<LocationDetailsProps> = ({ entity }) => {
  const getLocationTypeNepali = (type: string) => {
    const translations: { [key: string]: string } = {
      'province': 'प्रदेश',
      'district': 'जिल्ला',
      'metropolitan_city': 'महानगरपालिका',
      'sub_metropolitan_city': 'उपमहानगरपालिका',
      'municipality': 'नगरपालिका',
      'rural_municipality': 'गाउँपालिका',
      'ward': 'वडा',
      'constituency': 'निर्वाचन क्षेत्र'
    };
    return translations[type] || type;
  };

  return (
    <div>
      <EntityPicture
        pictures={entity.pictures}
        alt={entity.names[0]?.en?.full || 'Location'}
        style={{ marginBottom: '20px' }}
      />

      {entity.tags && entity.tags.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <TagsDisplay tags={entity.tags} />
        </div>
      )}

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        border: `1px solid var(--border-color)`,
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: `0 1px 3px var(--shadow)`,
        backgroundColor: 'var(--bg-primary)',
        transition: 'background-color 0.3s ease, border-color 0.3s ease'
      }}>
        <tbody>
          <SectionHeader title="Location Details" />
          <DetailField label="ID" labelNe="आईडी">{entity.id}</DetailField>
          <DetailField label="Name" labelNe="नाम"><EntityName names={entity.names} /></DetailField>
          <DetailField label="Type" labelNe="प्रकार">
            {entity.location_type ? (
              <>
                {entity.location_type.replace('_', ' ')}<br />
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9em' }}>
                  {getLocationTypeNepali(entity.location_type)}
                </span>
              </>
            ) : 'Location'}
          </DetailField>
          <DetailField label="Administrative Level" labelNe="प्रशासनिक तह">{entity.administrative_level}</DetailField>
          <DetailField label="Parent Location" labelNe="मातृ स्थान">
            {entity.parent ? (
              entity.parent.startsWith('entity:') ? (
                <EntityLink entityId={entity.parent}>{entity.parent}</EntityLink>
              ) : (
                entity.parent
              )
            ) : null}
          </DetailField>
          <DetailField label="Area" labelNe="क्षेत्रफल">{entity.area ? `${entity.area} km²` : null}</DetailField>
          <DetailField label="Latitude" labelNe="अक्षांश">{entity.lat}</DetailField>
          <DetailField label="Longitude" labelNe="देशान्तर">{entity.lng}</DetailField>
          <DetailField label="Short Description" labelNe="छोटो विवरण">{entity.short_description ? <LangText text={entity.short_description} /> : null}</DetailField>
          <DetailField label="Description" labelNe="विवरण">{entity.description ? <MarkdownText text={entity.description} /> : null}</DetailField>
          <DetailField label="Created At" labelNe="सिर्जना मिति">{entity.created_at}</DetailField>

          <SectionHeader title="Miscellaneous" />
          <DetailField label="Slug" labelNe="स्लग">{entity.slug}</DetailField>
          <DetailField label="Version Number" labelNe="संस्करण नम्बर">{entity.version_summary.version_number}</DetailField>
          <DetailField label="Version Author" labelNe="संस्करण लेखक">{entity.version_summary.author.name || entity.version_summary.author.slug}</DetailField>
          <DetailField label="Change Description" labelNe="परिवर्तन विवरण">{entity.version_summary.change_description}</DetailField>
          <DetailField label="Last Modified" labelNe="अन्तिम परिमार्जन">{formattedDate(new Date(entity.version_summary.created_at))}</DetailField>
          <DetailField label="Attributes" labelNe="विशेषताहरू">
            {entity.attributes ? <AttributesDisplay attributes={entity.attributes} /> : null}
          </DetailField>
          <DetailField label="Attributions" labelNe="स्रोतहरू">
            {entity.attributions?.length ? (
              <div>
                {entity.attributions.map((attr, index) => (
                  <div key={index} style={{ marginBottom: '8px' }}>
                    <strong>
                      {attr.title.en?.value || attr.title.ne?.value}
                      {attr.title.en?.value && attr.title.ne?.value && (
                        <><br /><span style={{ color: 'var(--text-secondary)', fontSize: '0.9em', fontWeight: 'normal' }}>{attr.title.ne.value}</span></>
                      )}
                    </strong>
                    {attr.details && (
                      <div style={{ fontSize: '0.9em', color: 'var(--text-secondary)' }}>
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

export default LocationDetails;