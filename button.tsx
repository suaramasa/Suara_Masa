
import React from 'react';

export function Button({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return <button onClick={onClick} style={{ padding: '10px 20px', borderRadius: '8px' }}>{children}</button>;
}
