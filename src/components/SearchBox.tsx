import React from 'react';
import { useCombobox } from 'downshift';
import { SearchIcon } from '@heroicons/react/solid';
import Spinner from '../foundations/spinner';

type SearchBoxOption<T> = T & {
  id: number | string;
  option: string;
  optionSecondary?: string;
};

type SearchBoxProps<T> = {
  searchString: string;
  /** Descriptor to assist screen readers */
  searchDescriptor: string;
  placeholder: string;
  onSearchChange: (searchString: string) => void;
  options: SearchBoxOption<T>[];
  onSelect: (option: SearchBoxOption<T>) => void;
  loading?: boolean;
};

const LoadingSpinner = ({
  loading,
  hasOptions,
}: {
  loading?: boolean;
  hasOptions: boolean;
}) => {
  if (!loading) {
    return null;
  }
  if (hasOptions) {
    return (
      <div className="absolute inset-0 z-20 bg-grey-50/70">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }
  return (
    <div className="bg-grey-50/70">
      <Spinner size="lg" color="primary" />
    </div>
  );
};

const SearchBox = <T extends {} = {}>({
  searchString,
  searchDescriptor,
  placeholder,
  options,
  onSelect,
  onSearchChange,
  loading,
}: SearchBoxProps<T>) => {
  const {
    isOpen,
    openMenu,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: options,
    inputValue: searchString,
    onInputValueChange: changes => {
      if (changes.type !== '__input_change__') {
        return;
      }
      onSearchChange(changes.inputValue || '');
    },
    onSelectedItemChange: changes => {
      if (changes.selectedItem) {
        onSelect(changes.selectedItem);
      }
    },
  });
  const showDropdown = isOpen && (options.length || loading);
  return (
    <div onFocus={openMenu} className="relative">
      <div className="text-input flex flex-row gap-2">
        <label {...getLabelProps()}>
          <SearchIcon className="w-5 h-5" />
          <span className="sr-only">{searchDescriptor}</span>
        </label>
        <div {...getComboboxProps()} className="flex-grow">
          <input
            {...getInputProps()}
            placeholder={placeholder}
            className="w-full"
          />
        </div>
      </div>
      <div {...getMenuProps()} className="absolute bottom-0 w-full">
        {showDropdown && (
          <div className="relative w-full">
            <div className="absolute w-full">
              <div className={`relative menu-dropdown`}>
                <LoadingSpinner
                  loading={loading}
                  hasOptions={!!options.length}
                />
                {options.map((option, index) => (
                  <div
                    {...getItemProps({ item: option, index })}
                    key={option.id}
                    className={`menu-item ${
                      highlightedIndex === index ? 'menu-item-active' : ''
                    } flex flex-col`}
                  >
                    <div>{option.option}</div>
                    {option.optionSecondary && (
                      <div className="text-subtle text-sm">
                        {option.optionSecondary}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
