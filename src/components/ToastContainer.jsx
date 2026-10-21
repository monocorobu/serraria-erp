import React from 'react';
import { useApp } from '../context/AppContext';

export const ToastContainer = () => {
  const { toasts } = useApp();

  if (!toasts.length) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      maxWidth: '380px'
    }}>
      {toasts.map(t => {
        let bg = '#0F172A';
        let border = '#334155';
        let icon = 'ℹ️';

        if (t.type === 'success') {
          bg = '#064E3B';
          border = '#10B981';
          icon = '✅';
        } else if (t.type === 'error') {
          bg = '#7F1D1D';
          border = '#EF4444';
          icon = '❌';
        } else if (t.type === 'warning') {
          bg = '#78350F';
          border = '#F59E0B';
          icon = '⚠️';
        }

        return (
          <div
            key={t.id}
            style={{
              backgroundColor: bg,
              border: `1.5px solid ${border}`,
              color: '#FFFFFF',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <span>{icon}</span>
            <span style={{ lineHeight: 1.35 }}>{t.message}</span>
          </div>
        );
      })}
    </div>
  );
};
