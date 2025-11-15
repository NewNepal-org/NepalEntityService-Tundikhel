import React from 'react';
import type { Education } from '../../common/nes-types';
import LangText from './LangText';
import DetailField from './DetailField';
import SubSectionHeader from './SubSectionHeader';

interface EducationSectionProps {
  education?: Education[] | null;
}

const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  const edu = education?.[0];
  
  if (!edu || (!edu.institution && !edu.degree && !edu.field && !edu.start_year && !edu.end_year)) {
    return (
      <>
        <SubSectionHeader title="Education" />
        <DetailField label="Education"><em>No Records found</em></DetailField>
      </>
    );
  }

  return (
    <>
      <SubSectionHeader title="Education" />
      <DetailField label="Institution" labelNe="शिक्षा संस्था">{edu.institution ? <LangText text={edu.institution} /> : null}</DetailField>
      <DetailField label="Degree" labelNe="डिग्री">{edu.degree ? <LangText text={edu.degree} /> : null}</DetailField>
      <DetailField label="Field" labelNe="विषय">{edu.field ? <LangText text={edu.field} /> : null}</DetailField>
      <DetailField label="Start Year" labelNe="सुरु वर्ष">{edu.start_year}</DetailField>
      <DetailField label="End Year" labelNe="अन्त्य वर्ष">{edu.end_year}</DetailField>
    </>
  );
};

export default EducationSection;