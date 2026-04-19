import React from 'react';

export default function Spinner({ size = 'md', className = '' }) {
  const s = { sm: 'w-4 h-4 border', md: 'w-8 h-8 border-2', lg: 'w-14 h-14 border-2' };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${s[size]} border-ash border-t-gold rounded-full animate-spin`} />
    </div>
  );
}
