
import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  id?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, id }) => {
  return (
    <div id={id} className="mb-10 flex flex-col items-center text-center">
      <h2 className="text-red-600 font-bold uppercase tracking-[0.3em] text-sm mb-4">{subtitle}</h2>
      <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight">{title}</h3>
      <div className="w-20 h-1.5 bg-red-600 mt-6 rounded-full" />
    </div>
  );
};

export default SectionHeader;
