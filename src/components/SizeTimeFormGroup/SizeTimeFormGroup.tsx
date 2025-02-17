import React from 'react';
import {
  Flex,
  FlexItem,
  NumberInput,
  NumberInputProps,
} from '@patternfly/react-core';
import { DropdownWithToggle, IDropdownOption } from '@app/components';

export type SizeTimeFormGroup = NumberInputProps & {
  /** id of dropdown element */
  id: string;
  /** id of dropdown toggle button */
  toggleId: string;
  /** id of dropdown element */
  dropdownValue?: string;
  /** name attribute of dropdown element */
  name: string;
  /** handler method of dropdown */
  onSelectOption?: (value: string, event) => void;
  /** aria label for dropdown element */
  ariaLabel?: string;
  /** determines whether to display memory units or time units */
  type: string;
};

export const SizeTimeFormGroup: React.FC<SizeTimeFormGroup> = ({
  id,
  toggleId,
  dropdownValue,
  ariaLabel,
  onSelectOption,
  name,
  inputName,
  onChange,
  onPlus,
  onMinus,
  value,
  plusBtnProps,
  minusBtnProps,
  type,
  min,
}) => {
  const timeUnits: IDropdownOption[] = [
    { key: 'milliseconds', value: 'milliseconds', isDisabled: false },
    { key: 'seconds', value: 'seconds', isDisabled: false },
    { key: 'days', value: 'days', isDisabled: false },
    { key: 'months', value: 'months', isDisabled: false },
    { key: 'years', value: 'years', isDisabled: false },
  ];

  const memoryUnits: IDropdownOption[] = [
    { key: 'bytes', value: 'bytes', isDisabled: false },
    { key: 'kibibytes', value: 'kibibytes', isDisabled: false },
    { key: 'mebibytes', value: 'mebibytes', isDisabled: false },
    { key: 'gibibytes', value: 'gibibytes', isDisabled: false },
    { key: 'tebibytes', value: 'tebibytes', isDisabled: false },
  ];

  const getItemsForType = (type: string) => {
    switch (type) {
      case 'time':
        return timeUnits;
      case 'memory':
        return memoryUnits;
      default:
        return [];
    }
  };

  return (
    <Flex>
      <FlexItem grow={{ default: 'grow' }}>
        <NumberInput
          inputName={inputName}
          onChange={onChange}
          onPlus={onPlus}
          onMinus={onMinus}
          value={value}
          plusBtnProps={plusBtnProps}
          minusBtnProps={minusBtnProps}
          min={min}
          widthChars={10}
        />
      </FlexItem>
      <FlexItem>
        <DropdownWithToggle
          id={id}
          toggleId={toggleId}
          ariaLabel={ariaLabel}
          onSelectOption={onSelectOption}
          items={getItemsForType(type)}
          name={name}
          value={dropdownValue || ''}
        />
      </FlexItem>
    </Flex>
  );
};
