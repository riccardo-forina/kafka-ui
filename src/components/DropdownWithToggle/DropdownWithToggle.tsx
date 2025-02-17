import React, { useState } from 'react';
import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import CaretDownIcon from '@patternfly/react-icons/dist/js/icons/caret-down-icon';

interface IDropdownWithToggleProps {
  id: string;
  toggleId: string;
  value: string;
  name: string;
  items: IDropdownOption[];
  onSelectOption?: (value: string, event) => void;
  ariaLabel?: string;
  menuAppendTo?: HTMLElement | (() => HTMLElement) | 'parent' | 'inline';
  isLabelAndValueNotSame?: boolean;
}

export interface IDropdownOption {
  value?: string;
  label?: string;
  key?: string;
  isDisabled?: boolean;
}

export const DropdownWithToggle: React.FC<IDropdownWithToggleProps> = ({
  id,
  toggleId,
  items,
  value,
  ariaLabel,
  onSelectOption,
  name,
  menuAppendTo,
  isLabelAndValueNotSame,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>();

  const onToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const onSelect = (e) => {
    const value: string = e.currentTarget.textContent;
    if (onSelectOption && value) {
      e.target.name = name;
      onSelectOption(value.toLowerCase(), e);
    }
    setIsOpen((isOpen) => !isOpen);
  };

  const getItems = (options: IDropdownOption[]) => {
    const items = options.map((option) => {
      const { key, value, label } = option;

      return (
        <DropdownItem key={key} value={value}>
          {label || value}
        </DropdownItem>
      );
    });

    return items;
  };

  const getSelectedValue = () => {
    if (isLabelAndValueNotSame) {
      const filteredOption = items?.filter((item) => item.value === value)[0];
      return filteredOption?.label;
    }
    return value;
  };

  const dropdownToggle = (
    <DropdownToggle
      id={toggleId}
      onToggle={onToggle}
      toggleIndicator={CaretDownIcon}
    >
      {getSelectedValue()}
    </DropdownToggle>
  );

  return (
    <Dropdown
      name={name}
      id={id}
      onSelect={onSelect}
      toggle={dropdownToggle}
      isOpen={isOpen}
      aria-label={ariaLabel}
      dropdownItems={getItems(items)}
      menuAppendTo={menuAppendTo}
    />
  );
};
