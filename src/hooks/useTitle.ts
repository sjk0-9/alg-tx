// Inspired by https://github.com/rehooks/document-title
// License: MIT
import { useEffect, useRef } from 'react';
import { NAME, SITE } from '../lib/helpers/names';

const useDocumentTitle = (title?: string) => {
  const originalTitle = useRef(document.title);

  useEffect(() => {
    if (title) {
      document.title = `${NAME} - ${title}`;
    } else {
      document.title = SITE;
    }
  }, [title]);

  useEffect(
    () => () => {
      document.title = originalTitle.current;
    },
    []
  );
};

export default useDocumentTitle;
