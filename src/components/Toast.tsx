import { isString } from 'lodash';
import React from 'react';
import toast, { ToastOptions } from 'react-hot-toast';
import Spinner from '../foundations/spinner';

export const CustomLoadingToast = ({
  children,
  linkText,
  onLinkClick,
}: {
  children: React.ReactNode;
  linkText?: string;
  onLinkClick?: () => void;
}) => (
  <div className="flex items-center bg-white rounded-lg drop-shadow-lg px-2 py-2.5 gap-2">
    <Spinner size="sm" color="primary" />
    {children}
    {linkText && (
      <button className="pl-2 text-primary underline" onClick={onLinkClick}>
        {linkText}
      </button>
    )}
  </div>
);

export const createCustomLoadingToast = (
  val: { text: string; linkText?: string; onLinkClick?: () => void } | string,
  toastOptions?: ToastOptions
) => {
  let text: string;
  let linkText: string | undefined;
  let onLinkClick: (() => void) | undefined;

  if (isString(val)) {
    text = val;
  } else {
    ({ text, linkText, onLinkClick } = val);
  }

  toast.custom(
    <CustomLoadingToast linkText={linkText} onLinkClick={onLinkClick}>
      {text}
    </CustomLoadingToast>,
    { duration: Infinity, ...toastOptions }
  );
};
