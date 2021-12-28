import React from 'react';
import { SITE } from '../../lib/helpers/names';
import './logo.css';

type LogoProps = {
  size?: 'md' | 'lg';
};

const sizeClass = {
  md: 'logo-md',
  lg: 'logo-lg',
};

const Logo = ({ size = 'md' }: LogoProps) => (
  <div className={`logo ${sizeClass[size]}`}>{SITE}</div>
);

export default Logo;
