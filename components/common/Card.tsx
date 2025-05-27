
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children, className, actions }) => {
  return (
    <div className={`bg-clinic-surface shadow-lg rounded-xl p-6 ${className || ''}`}>
      {title && (
        <div className={`flex justify-between items-center mb-4 pb-2 ${actions ? 'border-b border-gray-200' : ''}`}>
          <h2 className="text-xl font-semibold text-clinic-text-primary">{title}</h2>
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Card;
