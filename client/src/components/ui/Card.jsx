import React from 'react';

/**
 * Card Component
 * A basic container with premium styling and subtle hover interactions.
 */
const Card = ({ children, className = '', hoverable = true, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-bg-secondary border border-border-dark rounded-card p-6 
        ${hoverable ? 'hover:border-primary/50 transition-all duration-200 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
