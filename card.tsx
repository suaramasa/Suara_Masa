
import React from 'react';

export function Card({ children }: { children: React.ReactNode }) {
  return <div style={{ border: '1px solid #ccc', borderRadius: '12px', padding: '16px' }}>{children}</div>;
}
