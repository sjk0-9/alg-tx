import { useEffect, useRef } from 'react';

// https://blog.logrocket.com/how-to-get-previous-props-state-with-react-hooks/

const usePrevious = <T>(value: T) => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export default usePrevious;
