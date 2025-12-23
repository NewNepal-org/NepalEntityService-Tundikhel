import React from 'react';
import type { Project } from '../../common/nes-types';
import DetailField from './DetailField';
import SectionHeader from './SectionHeader';
import AttributesDisplay from './AttributesDisplay';
import { formattedDate } from '../../utils/date';

interface ProjectDetailsProps {
  entity: Project;
}

const formatCurrency = (amount: number, currency?: string | null): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${formatter.format(amount)} ${currency || 'USD'}`;
};

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ entity }) => {
  const approvalDate = entity.dates?.find(d => d.type === 'APPROVAL')?.date;
  const startDate = entity.dates?.find(d => d.type === 'START')?.date;
  const completionDate = entity.dates?.find(d => d.type === 'COMPLETION')?.date;

  return (
    <div>
      {entity.tags && entity.tags.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {entity.tags.map((tag, idx) => (
              <span key={idx} style={{
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: 'var(--tag-bg)',
                color: 'var(--tag-text)',
                fontSize: '0.85em'
              }}>
                {tag.normalized_tag || tag.donor_tag || tag.category}
              </span>
            ))}
          </div>
        </div>
      )}

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px var(--shadow)',
        backgroundColor: 'var(--bg-primary)',
        transition: 'background-color 0.3s ease, border-color 0.3s ease'
      }}>
        <tbody>
          <SectionHeader title="Project Details" />
          <DetailField label="ID" labelNe="आईडी">{entity.id}</DetailField>
          <DetailField label="Stage" labelNe="चरण">
            {entity.stage ? (
              <span style={{
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: entity.stage === 'completed' ? 'var(--success-bg)' : 'var(--warning-bg)',
                color: entity.stage === 'completed' ? 'var(--success-text)' : 'var(--warning-text)',
                textTransform: 'capitalize'
              }}>
                {entity.stage}
              </span>
            ) : null}
          </DetailField>
          <DetailField label="Implementing Agency" labelNe="कार्यान्वयन एजेन्सी">{entity.implementing_agency}</DetailField>
          <DetailField label="Executing Agency" labelNe="कार्यकारी एजेन्सी">{entity.executing_agency}</DetailField>
          {entity.project_url && (
            <DetailField label="Project URL" labelNe="परियोजना URL">
              <a href={entity.project_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--link-color)' }}>
                {entity.project_url}
              </a>
            </DetailField>
          )}

          <SectionHeader title="Timeline" />
          <DetailField label="Approval Date" labelNe="स्वीकृति मिति">{approvalDate}</DetailField>
          <DetailField label="Start Date" labelNe="सुरु मिति">{startDate}</DetailField>
          <DetailField label="Completion Date" labelNe="समाप्ति मिति">{completionDate}</DetailField>

          <SectionHeader title="Financing" />
          <DetailField label="Total Commitment" labelNe="कुल प्रतिबद्धता">
            {entity.total_commitment ? formatCurrency(entity.total_commitment, 'USD') : null}
          </DetailField>
          <DetailField label="Total Disbursement" labelNe="कुल वितरण">
            {entity.total_disbursement ? formatCurrency(entity.total_disbursement, 'USD') : null}
          </DetailField>
          {entity.financing && entity.financing.length > 0 && (
            <DetailField label="Financing Sources" labelNe="वित्तीय स्रोतहरू">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {entity.financing.map((f, idx) => (
                  <div key={idx} style={{
                    padding: '8px',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '4px',
                    fontSize: '0.9em'
                  }}>
                    <div><strong>{f.donor}</strong></div>
                    {f.amount && <div>{formatCurrency(f.amount, f.currency)}</div>}
                    {f.assistance_type && <div style={{ color: 'var(--text-secondary)' }}>Type: {f.assistance_type}</div>}
                    {f.transaction_type && <div style={{ color: 'var(--text-secondary)' }}>Transaction: {f.transaction_type}</div>}
                  </div>
                ))}
              </div>
            </DetailField>
          )}

          {entity.sectors && entity.sectors.length > 0 && (
            <>
              <SectionHeader title="Sectors" />
              <DetailField label="Sectors" labelNe="क्षेत्रहरू">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {entity.sectors.map((s, idx) => (
                    <div key={idx}>{s.normalized_sector || s.donor_sector}</div>
                  ))}
                </div>
              </DetailField>
            </>
          )}

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
                    <strong>{attr.title.en?.value || attr.title.ne?.value}</strong>
                    {attr.details && (
                      <div style={{ fontSize: '0.9em', color: 'var(--text-secondary)' }}>
                        {attr.details.en?.value || attr.details.ne?.value}
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

export default ProjectDetails;
