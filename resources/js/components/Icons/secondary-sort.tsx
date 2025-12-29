import React from 'react';

interface SecondarySortProps {
  state?: 'default' | 'hovered' | 'clicked';
  className?: string;
}

export function SecondarySort({ state = 'default', className = '' }: SecondarySortProps) {
  const getBackgroundColor = () => {
    switch (state) {
      case 'hovered':
        return '#FFFFFF';
      case 'clicked':
        return '#FFBD00';
      case 'default':
      default:
        return '#F3EFD0';
    }
  };

  const getBorder = () => {
    if (state === 'hovered' || state === 'clicked') {
      return '1px solid #730000';
    }
    return 'none';
  };

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        width: '36px',
        height: '36px',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '8px',
        background: getBackgroundColor(),
        border: getBorder(),
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Up Arrow */}
        <path
          d="M5 2L5 11"
          stroke="#730000"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M2 5L5 2L8 5"
          stroke="#730000"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Down Arrow */}
        <path
          d="M11 14L11 5"
          stroke="#730000"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M14 11L11 14L8 11"
          stroke="#730000"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
