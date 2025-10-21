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
  <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1D4ED8' }}>
    {children}
  </p>
);

export const LargeTitle = ({ children }) => (
    <p style={{ color: '#1D4ED8', fontSize:'20px', fontWeight: 'bold'}}>
        {children}
    </p>
);

export const SmallContent = ({ children }) => (
  <p style={{ fontSize: '14px' }}>
    {children}
  </p>
);

export const Code = ({ children }) => (
  <code style={{ background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', fontSize: '13px' }}>
    {children}
  </code>
);

export const TagSelected = ({ children }) => (
    <span className="bg-blue-500 text-white px-1 rounded">
        {children}
    </span>
);