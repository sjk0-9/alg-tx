import React from 'react';

type WrapperProps = { children: React.ReactNode };

const InlineWrapper = ({ children }: WrapperProps) => (
  <div className="inline-wrapper">{children}</div>
);

const FullSizeWrapper = ({ children }: WrapperProps) => <div>{children}</div>;

export { InlineWrapper, FullSizeWrapper };
