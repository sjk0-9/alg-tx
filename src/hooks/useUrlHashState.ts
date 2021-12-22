import { useLocation, useNavigate } from 'react-router-dom';
import { fromBase64, toBase64 } from '../lib/helpers/base64';

type UseUrlStateReturn<T> = {
  data?: T;
  setData: (data: T) => void;
};

const decodeJsonHash = (hash: string) => {
  // Remove the # at the start of the string
  const base64 = hash.slice(1);
  console.log(base64);
  try {
    const decoded = fromBase64(base64);
    console.log(decoded);
    return JSON.parse(decoded);
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

const encodeJsonHash = <T>(data: T) => `#${toBase64(JSON.stringify(data))}`;

const useUrlHashState = <T>(): UseUrlStateReturn<T> => {
  const { hash } = useLocation();
  const navigate = useNavigate();

  const data = decodeJsonHash(hash);

  const setData = (newData: T) => {
    navigate(encodeJsonHash(newData), { replace: true });
  };

  return { data, setData };
};

export default useUrlHashState;
