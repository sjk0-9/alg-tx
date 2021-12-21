import React from 'react';
import Spinner from '.';

const WrappedSpinner = ({
  loading,
  children,
}: {
  loading: boolean;
  children: React.ReactNode;
}) => (
  <div className="relative">
    <div className={loading ? 'invisible' : ''}>{children}</div>
    {loading && (
      <div className="absolute inset-0 h-full">
        <Spinner />
      </div>
    )}
  </div>
);

export default WrappedSpinner;
