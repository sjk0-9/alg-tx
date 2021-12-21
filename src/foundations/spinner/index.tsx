import React from 'react';
import './spinner.css';

const Spinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-white la-ball-grid-beat la-sm">
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
