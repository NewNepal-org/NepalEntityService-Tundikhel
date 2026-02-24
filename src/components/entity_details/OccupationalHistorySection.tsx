import React from 'react';
import type { Position } from '../../common/nes-types';
import LangText from './LangText';
import DetailField from './DetailField';
import SubSectionHeader from './SubSectionHeader';

interface OccupationalHistorySectionProps {
  positions?: Position[] | null;
}

const OccupationalHistorySection: React.FC<OccupationalHistorySectionProps> = ({ positions }) => {
  const pos = positions?.[0];
  
  // Don't render anything if there's no position data
  if (!pos || (!pos.title && !pos.organization && !pos.start_date && !pos.end_date && !pos.description)) {
    return null;
  }

  return (
    <>
      <SubSectionHeader title="Occupational History" />
      <DetailField label="Title" labelNe="पद">{pos.title ? <LangText text={pos.title} /> : null}</DetailField>
      <DetailField label="Organization" labelNe="संस्था">{pos.organization ? <LangText text={pos.organization} /> : null}</DetailField>
      <DetailField label="Start Date" labelNe="सुरु मिति">{pos.start_date}</DetailField>
      <DetailField label="End Date" labelNe="अन्त्य मिति">{pos.end_date}</DetailField>
      <DetailField label="Description" labelNe="विवरण">{pos.description}</DetailField>
    </>
  );
};

export default OccupationalHistorySection;