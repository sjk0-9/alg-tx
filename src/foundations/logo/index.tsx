import React from 'react';
import './logo.css';

type LogoProps = {
  size?: 'md' | 'lg';
};

const sizeClass = {
  md: 'logo-md',
  lg: 'logo-lg',
};

const Logo = ({ size = 'md' }: LogoProps) => (
  <div className={`logo ${sizeClass[size]}`}>brx.algo</div>
);

export default Logo;
