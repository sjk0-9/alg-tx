import React from 'react';

const mergeClassName = (name: string, props: React.HTMLProps<HTMLElement>) => {
  if (props.className) {
    return `${name} ${props.className}`;
  }
  return name;
};

export const Label = (props: React.HTMLProps<HTMLLabelElement>) => (
  <label className={mergeClassName('form-label', props)} {...props} />
);

export const TextInput = (
  props: Omit<React.HTMLProps<HTMLInputElement>, 'type'>
) => (
  <input
    type="text"
    className={mergeClassName('text-input', props)}
    {...props}
  />
);

export const Checkbox = (
  props: Omit<React.HTMLProps<HTMLInputElement>, 'type'>
) => (
  <input
    type="checkbox"
    className={mergeClassName('checkbox-input', props)}
    {...props}
  />
);
