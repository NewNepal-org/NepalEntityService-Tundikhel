import React from 'react';
import type { Organization } from '../../common/nes-types';
import EntityName from './EntityName';
import EntityPicture from './EntityPicture';
import LangText from './LangText';
import MarkdownText from './MarkdownText';
import DetailField from './DetailField';
import SectionHeader from './SectionHeader';
import AttributesDisplay from './AttributesDisplay';
import TagsDisplay from './TagsDisplay';
import CollapsibleSection from './CollapsibleSection';
import { formattedDate } from '../../utils/date';

interface InternationalOrgDetailsProps {
  entity: Organization;
}

const InternationalOrgDetails: React.FC<InternationalOrgDetailsProps> = ({ entity }) => {
  return (
    <div>
      <EntityPicture
        pictures={entity.pictures}
        alt={entity.names[0]?.en?.full || 'International Organization'}
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
          <SectionHeader title="International Organization Details" titleNe="अन्तर्राष्ट्रिय संगठन विवरण" />
          <DetailField label="ID" labelNe="आईडी">{entity.id}</DetailField>
          <DetailField label="Name" labelNe="नाम"><EntityName names={entity.names} /></DetailField>
          <DetailField label="Short Description" labelNe="छोटो विवरण">{entity.short_description ? <LangText text={entity.short_description} /> : null}</DetailField>
          <DetailField label="Description" labelNe="विवरण">{entity.description ? <MarkdownText text={entity.description} /> : null}</DetailField>

          {entity.contacts && entity.contacts.length > 0 && (
            <>
              <SectionHeader title="Contact Information" titleNe="सम्पर्क जानकारी" />
              {entity.contacts.map((contact, idx) => (
                <DetailField key={idx} label={contact.type} labelNe={contact.type}>
                  {contact.type === 'EMAIL' || contact.type === 'URL' ? (
                    <a href={contact.type === 'EMAIL' ? `mailto:${contact.value}` : contact.value} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       style={{ color: 'var(--link-color)' }}>
                      {contact.value}
                    </a>
                  ) : (
                    contact.value
                  )}
                </DetailField>
              ))}
            </>
          )}

          {entity.identifiers && entity.identifiers.length > 0 && (
            <>
              <SectionHeader title="External Links" titleNe="बाह्य लिङ्कहरू" />
              {entity.identifiers.map((identifier, idx) => (
                <DetailField key={idx} label={identifier.scheme} labelNe={identifier.scheme}>
                  <a href={identifier.value} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--link-color)' }}>
                    {identifier.value}
                  </a>
                </DetailField>
              ))}
            </>
          )}

          {entity.attributes && Object.keys(entity.attributes).length > 0 && (
            <>
              <SectionHeader title="Attributes" titleNe="विशेषताहरू" />
              <tr>
                <td colSpan={2} style={{ padding: '16px 20px', backgroundColor: 'var(--bg-primary)' }}>
                  <AttributesDisplay attributes={entity.attributes} />
                </td>
              </tr>
            </>
          )}

          {entity.attributions && entity.attributions.length > 0 && (
            <>
              <SectionHeader title="Attributions" titleNe="स्रोतहरू" />
              <tr>
                <td colSpan={2} style={{ padding: '16px 20px', backgroundColor: 'var(--bg-primary)' }}>
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
                </td>
              </tr>
            </>
          )}

          <CollapsibleSection title="View Version & Audit Details" titleNe="संस्करण र लेखापरीक्षण विवरण हेर्नुहोस्" defaultOpen={false}>
            <DetailField label="Slug" labelNe="स्लग">{entity.slug}</DetailField>
            <DetailField label="Version Number" labelNe="संस्करण नम्बर">{entity.version_summary.version_number}</DetailField>
            <DetailField label="Version Author" labelNe="संस्करण लेखक">{entity.version_summary.author.name || entity.version_summary.author.slug}</DetailField>
            <DetailField label="Change Description" labelNe="परिवर्तन विवरण">{entity.version_summary.change_description}</DetailField>
            <DetailField label="Last Modified" labelNe="अन्तिम परिमार्जन">{formattedDate(new Date(entity.version_summary.created_at))}</DetailField>
            <DetailField label="Created At" labelNe="सिर्जना मिति">{formattedDate(new Date(entity.created_at))}</DetailField>
          </CollapsibleSection>
        </tbody>
      </table>
    </div>
  );
};

export default InternationalOrgDetails;
