import React from 'react';
import { motion } from 'framer-motion';

/**
 * Loader Component
 * Supports both spinner and skeleton variants for versatile loading states.
 * 
 * @param {string} variant - 'spinner' | 'skeleton'
 * @param {string} shape - 'circle' | 'rect' (for skeleton)
 * @param {string} className - extension styles
 */
const Loader = ({ variant = 'spinner', shape = 'rect', className = '' }) => {
  if (variant === 'skeleton') {
    return (
      <div
        className={`bg-bg-tertiary animate-pulse ${
          shape === 'circle' ? 'rounded-full' : 'rounded-card'
        } ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-8 h-8 border-2 border-text-muted border-t-primary rounded-full"
      />
    </div>
  );
};

export default Loader;
