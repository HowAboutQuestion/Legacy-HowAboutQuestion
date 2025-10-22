import React from 'react';

export const TOOLTIP = {
  ssm: { tooltip: { width: 340, padding: '16px' } },
  sm: { tooltip: { width: 360, padding: '16px' } },
  md: { tooltip: { width: 500, padding: '16px' } },
  lg: { tooltip: { width: 550, padding: '16px' } },
};

export const withTooltip = (size, extra = {}) => ({
  ...TOOLTIP[size],
  ...extra,
});


export const MediumTitle = ({ children }) => (
  <p className="text-[18px] font-bold text-blue-700">{children}</p>
);

export const LargeTitle = ({ children }) => (
  <p className="text-[20px] font-bold text-blue-700">{children}</p>
);

export const SmallContent = ({ children }) => (
  <p className="text-[14px] leading-relaxed">{children}</p>
);

export const Code = ({ children }) => (
  <code className="bg-gray-100 px-2 py-[2px] rounded text-[13px] font-mono text-gray-800">
    {children}
  </code>
);

export const TagSelected = ({ children }) => (
  <span className="bg-blue-500 text-white px-1 rounded">{children}</span>
);