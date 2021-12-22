import { ClipboardCheckIcon, ClipboardCopyIcon } from '@heroicons/react/solid';
import React, { useState } from 'react';

type CopyState = undefined | 'copying' | 'copied';

const CopyButton = ({ copyText }: { copyText: string }) => {
  const [copyState, setCopyState] = useState<CopyState>();

  const onClick = async () => {
    if (copyState) {
      return;
    }
    setCopyState('copying');
    await navigator.clipboard.writeText(copyText);
    setCopyState('copied');
    setTimeout(() => {
      setCopyState(undefined);
    }, 2000);
  };

  const startOpacity =
    copyState === 'copied'
      ? 'opacity-0 duration-75'
      : 'opacity-100 duration-200';
  const endOpacity =
    copyState === 'copied'
      ? 'opacity-100 duration-75'
      : 'opacity-0 duration-200';

  return (
    <button
      onClick={onClick}
      className={`${
        copyState
          ? 'text-subtle-a'
          : 'text-subtle hover:text-subtle-h active:text-subtle-a'
      }`}
    >
      <div className="relative">
        <ClipboardCopyIcon
          className={`w-5 h-5 transition-opacity ${startOpacity}`}
        />
        <ClipboardCheckIcon
          className={`absolute inset-0 left-[-1px] w-5 h-5 text-subtle-a transition-opacity ${endOpacity}`}
        />
      </div>
    </button>
  );
};

export default CopyButton;
