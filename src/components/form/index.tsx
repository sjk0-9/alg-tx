import React from 'react';

const mergeClassName = (name: string, props: React.HTMLProps<HTMLElement>) => {
  if (props.className) {
    return `${name} ${props.className}`;
  }
  return name;
};

const Label = (props: React.HTMLProps<HTMLLabelElement>) => (
  <label className={mergeClassName('form-label', props)} {...props} />
);

const TextInput = (props: Omit<React.HTMLProps<HTMLInputElement>, 'type'>) => (
  <input
    type="text"
    className={mergeClassName('text-input', props)}
    {...props}
  />
);

const Checkbox = (props: Omit<React.HTMLProps<HTMLInputElement>, 'type'>) => (
  <input
    type="checkbox"
    className={mergeClassName('text-input', props)}
    {...props}
  />
);

export { Label, TextInput, Checkbox };
