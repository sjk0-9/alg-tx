import React from 'react';
import './banner.css';

type BannerProps = {
  type: 'error' | 'warning';
  size?: 'md' | 'sm';
  title?: string;
  children: React.ReactNode;
};

const typeToClass = {
  error: 'banner-error',
  warning: 'banner-warning',
};

const Banner = ({ type, title, children, size = 'md' }: BannerProps) => (
  <div className={`${typeToClass[type]} ${size === 'sm' ? 'banner-sm' : ''}`}>
    {title && <h3>{title}</h3>}
    <div>{children}</div>
  </div>
);

export default Banner;
