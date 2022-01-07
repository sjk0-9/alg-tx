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
  >
    {children}
  </a>
);

// {icon && <ExternalLinkIcon className="w-4 h-4" />}
// className={`inline-flex w-min whitespace-nowrap after:content-['url("${ExternalLinkIcon}")']`}
export default ExternalLink;
