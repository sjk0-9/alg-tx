import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useUrlHashState from '../../hooks/useUrlHashState';

const AtomicTransferPage = () => {
  const location = useLocation();
  const { data, setData } = useUrlHashState<{}>();

  useEffect(() => {
    if (!data) {
      setData({ hello: 'word' });
    }
  }, []);

  return (
    <div>
      {JSON.stringify(location)} {JSON.stringify(data)}
    </div>
  );
};

export default AtomicTransferPage;
