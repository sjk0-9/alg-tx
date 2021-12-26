import { ExternalLinkIcon } from '@heroicons/react/solid';
import React from 'react';

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
    className="inline-flex w-min whitespace-nowrap"
  >
    {children}
    {icon && <ExternalLinkIcon className="w-4 h-4" />}
  </a>
);

export default ExternalLink;
