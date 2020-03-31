import * as React from 'react';
import { ChoiceGroup as ChoiceGroupOriginal } from 'office-ui-fabric-react';

export const ChoiceGroup = () => (
  <ChoiceGroupOriginal
    className="defaultChoiceGroup"
    defaultSelectedKey="B"
    options={[
      {
        key: 'A',
        text: 'Option A',
      },
      {
        key: 'B',
        text: 'Option B',
      },
      {
        key: 'C',
        text: 'Option C',
        disabled: true,
      },
      {
        key: 'D',
        text: 'Option D',
      },
    ]}
    label="Pick one"
    required={true}
  />
);

const scenario = <ChoiceGroup />;

export default scenario;
