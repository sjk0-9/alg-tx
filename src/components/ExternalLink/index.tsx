import React from 'react';
import './externalLink.css';

type ExternalLinkProps = {
  to: string;
  children: React.ReactNode;
  icon?: boolean;
};

const ExternalLink = ({ to, children, icon = true }: ExternalLinkProps) => (
  <a
    href={to}
    target="_blank"
    rel="noopener noreferrer"
    className="external-link"
    onClick={e => {
      e.stopPropagation();
    }}
  >
    {children}
  </a>
);

export default ExternalLink;
