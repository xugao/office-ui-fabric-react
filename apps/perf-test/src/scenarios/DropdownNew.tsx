import * as React from 'react';
import { IDropdownOption, DropdownMenuItemType } from 'office-ui-fabric-react';
import { MyDropdown } from '@uifabric/experiments/lib/compose/DropdownCompose';

const options: IDropdownOption[] = [
  { key: 'fruitsHeader', text: 'Fruits', itemType: DropdownMenuItemType.Header },
  { key: 'apple', text: 'Apple' },
  { key: 'banana', text: 'Banana' },
  { key: 'orange', text: 'Orange', disabled: true },
  { key: 'grape', text: 'Grape' },
  { key: 'divider_1', text: '-', itemType: DropdownMenuItemType.Divider },
  { key: 'vegetablesHeader', text: 'Vegetables', itemType: DropdownMenuItemType.Header },
  { key: 'broccoli', text: 'Broccoli' },
  { key: 'carrot', text: 'Carrot' },
  { key: 'lettuce', text: 'Lettuce' },
];

export const DropdownNew = () => (
  <MyDropdown placeholder="Select an option" label="Basic uncontrolled example" options={options} />
);

const scenario = <DropdownNew />;

export default scenario;
