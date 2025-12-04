import React from 'react';

interface InfoItemProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  badge?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, icon, fullWidth, badge }) => {
  return (
    <div className={`${fullWidth ? 'col-span-1 md:col-span-2' : ''}`}>
      <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
        {icon} {label}
      </p>
      {badge ? (
        <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
          {value}
        </span>
      ) : (
        <p className="text-lg font-semibold text-gray-800 break-words">{value}</p>
      )}
    </div>
  );
};

export default InfoItem;