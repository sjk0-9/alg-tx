import React from 'react';
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react';

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: React.ReactNode;
};
const Dialog = ({
  open,
  onClose,
  title,
  description,
  children,
}: DialogProps) => (
  <Transition show={open}>
    <HeadlessDialog
      open={open}
      onClose={onClose}
      as="div"
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="min-h-screen px-4 text-center">
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <HeadlessDialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        </Transition.Child>
        {/* This element is to trick the browser into centering the modal contents. */}
        <span className="inline-block h-screen align-middle" aria-hidden="true">
          &#8203;
        </span>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle bg-white shadow-xl transition-all transform rounded-2xl">
            <HeadlessDialog.Title as="h3" className="text-lg font-medium">
              {title}
            </HeadlessDialog.Title>
            <HeadlessDialog.Description className="sr-only">
              {description}
            </HeadlessDialog.Description>
            {children}
          </div>
        </Transition.Child>
      </div>
    </HeadlessDialog>
  </Transition>
);

export default Dialog;
