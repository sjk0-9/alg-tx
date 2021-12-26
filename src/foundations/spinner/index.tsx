import React from 'react';
import './spinner.css';

type SpinnerSizes = 'sm' | 'md' | 'lg';
type SpinnerProps = {
  size?: SpinnerSizes;
  color?: 'white' | 'primary';
};

const getSpinnerSize = (size: SpinnerSizes) => {
  switch (size) {
    case 'sm':
      return 'la-sm';
    case 'md':
      return '';
    case 'lg':
      return 'la-3x';
    default:
      throw new Error('Unknown size');
  }
};

const Spinner = ({ color = 'white', size = 'sm' }: SpinnerProps) => (
  <div className="flex items-center justify-center h-full">
    <div className={`text-${color} la-ball-grid-beat ${getSpinnerSize(size)}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
);

export default Spinner;
