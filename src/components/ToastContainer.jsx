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
        let iconSvg = (
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2.2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        );

        if (t.type === 'success') {
          bg = '#064E3B';
          border = '#10B981';
          iconSvg = (
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="#10B981" fill="none" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          );
        } else if (t.type === 'error') {
          bg = '#7F1D1D';
          border = '#EF4444';
          iconSvg = (
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="#EF4444" fill="none" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          );
        } else if (t.type === 'warning') {
          bg = '#78350F';
          border = '#F59E0B';
          iconSvg = (
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="#F59E0B" fill="none" strokeWidth="2.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          );
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
            <span style={{ display: 'flex', alignItems: 'center' }}>{iconSvg}</span>
            <span style={{ lineHeight: 1.35 }}>{t.message}</span>
          </div>
        );
      })}
    </div>
  );
};
