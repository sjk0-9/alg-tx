import React from 'react';
import { useCombobox } from 'downshift';

type SearchBoxOption<T> = T & {
  id: number | string;
  option: string;
  optionSecondary?: string;
};

type SearchBoxProps<T> = {
  searchString: string;
  onSearchChange: (searchString: string) => void;
  options: SearchBoxOption<T>[];
  onSelect: (option: SearchBoxOption<T>) => void;
};

const SearchBox = <T extends {} = {}>({
  searchString,
  options,
  onSelect,
  onSearchChange,
}: SearchBoxProps<T>) => {
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: options,
  });
  return (
    <div>
      <label {...getLabelProps()}>Search:</label>
      <div {...getComboboxProps()}>
        <input
          {...getInputProps()}
          value={searchString}
          onChange={e => onSearchChange(e.currentTarget.value)}
        />
        <button
          type="button"
          {...getToggleButtonProps()}
          aria-label="toggle menu"
        >
          S
        </button>
      </div>
      <ul {...getMenuProps()}>
        {isOpen &&
          options.map((option, index) => (
            <li {...getItemProps({ item: option, index })} key={option.id}>
              {option.option}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default SearchBox;
